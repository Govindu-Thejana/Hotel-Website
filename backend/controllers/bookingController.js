import RoomModel from '../models/roomModel.js';
import BookedRoomModel from '../models/bookedRoomModel.js';
import { generateBookingId, generateConfirmationCode } from '../middleware/generators.js';
import moment from 'moment';
import mongoose from 'mongoose';
import { sendBookingConfirmation } from '../services/bookingEmail.js';

// Function to create a new booking
export const createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            prefix,
            firstName,
            lastName,
            phone,
            email,
            country,
            address1,
            city,
            zipCode,
            cart
        } = req.body;

        console.log('Request Body:', req.body);

        // Validate room IDs in the cart
        const roomIds = cart.map(item => item.room._id);
        if (!roomIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Invalid room IDs in the cart' });
        }

        // Fetch all rooms in a single query
        const rooms = await RoomModel.find({ _id: { $in: roomIds } }).session(session);
        if (rooms.length !== cart.length) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'One or more rooms not found' });
        }

        // 1. First pass: Check availability for all rooms
        const availabilityErrors = [];
        const bookingItems = [];

        for (const item of cart) {
            const { room, checkIn, checkOut } = item;
            const roomRecord = rooms.find(r => r._id.toString() === room._id);

            if (!roomRecord) {
                availabilityErrors.push(`Room ${room.roomId} not found`);
                continue;
            }

            let adjustedCheckIn = new Date(Date.UTC(new Date(checkIn).getFullYear(), new Date(checkIn).getMonth(), new Date(checkIn).getDate(), 14, 0, 0));
            console.log('adjustedCheckIn:', adjustedCheckIn);
            let adjustedCheckOut = new Date(Date.UTC(new Date(checkOut).getFullYear(), new Date(checkOut).getMonth(), new Date(checkOut).getDate(), 11, 0, 0));
            console.log('adjustedCheckOut:', adjustedCheckOut);
            // Adjust check-in and check-out dates to the exact start and end of the day
            //const adjustedCheckIn = moment(checkIn, "MM/DD/YYYY").startOf('day').toDate();
            //const adjustedCheckOut = moment(checkOut, "MM/DD/YYYY").endOf('day').toDate();

            // Check if room is already booked for the given dates
            const existingBooking = await BookedRoomModel.findOne({
                roomId: room._id,
                $or: [
                    { checkIn: { $lte: checkOut }, checkOut: { $gte: checkIn } }
                ]
            }).session(session);

            if (existingBooking) {
                availabilityErrors.push(`Room ${room.roomId} is already booked for the selected dates.`);
                continue;
            }

            bookingItems.push({ item, roomRecord, adjustedCheckIn, adjustedCheckOut });
        }

        if (availabilityErrors.length > 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: 'Some rooms are unavailable',
                errors: availabilityErrors
            });
        }

        // 2. Second pass: Create bookings if all rooms are available
        const bookings = [];
        for (const { item, roomRecord, adjustedCheckIn, adjustedCheckOut } of bookingItems) {
            const { room, guests, totalAmount, addons } = item;

            // Generate bookedDates array
            const bookedDates = [];
            let currentDate = new Date(adjustedCheckIn);
            while (currentDate < adjustedCheckOut) {
                bookedDates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Create new booking
            const booking = new BookedRoomModel({
                bookingId: generateBookingId(),
                roomId: room._id,
                fullName: `${prefix} ${firstName} ${lastName}`,
                email,
                phone,
                checkIn: adjustedCheckIn,
                checkOut: adjustedCheckOut,
                bookedDates,
                guests,
                address: { country, address1, city, zipCode },
                totalAmount,
                addons,
                bookingConfirmationCode: generateConfirmationCode()
            });

            await booking.save({ session });

            // Update room status
            roomRecord.isbooked = true;
            await roomRecord.save({ session });

            bookings.push(booking);
        }

        // Commit transaction if everything is successful
        await session.commitTransaction();
        session.endSession();

        // Send confirmation email to customer
        try {
            for (const booking of bookings) {
                await sendBookingConfirmation(booking);
            }
        } catch (emailError) {
            console.error('Error sending confirmation emails:', emailError);
            return res.status(201).json({
                message: 'Booking created successfully, but confirmation emails failed to send',
                bookings,
                emailErrors: [`Failed to send confirmation email for booking ${booking.bookingConfirmationCode}`]
            });
        }

        return res.status(201).json({
            message: 'Booking created successfully',
            bookings
        });

    } catch (error) {
        console.error('Error creating booking:', error);

        // Abort transaction on error
        try {
            await session.abortTransaction();
        } catch (abortError) {
            console.error('Error aborting transaction:', abortError);
        }

        session.endSession();

        return res.status(500).json({
            message: 'Error creating booking',
            error: error.message
        });
    }
};


// Function to retrieve a booking by its bookingId
export const getBooking = async (req, res) => {
    try {
        const booking = await BookedRoomModel.findOne({ bookingId: req.params.bookingId });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving booking',
            error: error.message
        });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const booking = await BookedRoomModel.findOne({ bookingId: req.params.bookingId });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update room status
        const room = await RoomModel.findById(booking.roomId);
        if (room) {
            room.isBooked = false;
            await room.save();
        }

        await booking.deleteOne();
        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error cancelling booking',
            error: error.message
        });
    }
};

export const checkRoomAvailability = async (req, res) => {
    try {
        const { roomId, checkIn, checkOut } = req.query;

        const existingBooking = await BookedRoomModel.findOne({
            roomId,
            $or: [
                {
                    checkIn: { $lte: new Date(checkOut) },
                    checkOut: { $gte: new Date(checkIn) }
                }
            ]
        });

        res.status(200).json({ available: !existingBooking });
    } catch (error) {
        res.status(500).json({
            message: 'Error checking room availability',
            error: error.message
        });
    }
};

// Function to retrieve all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await BookedRoomModel.find().populate('roomId');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving bookings',
            error: error.message
        });
    }
};
export const getBookedDatesByRoomType = async (req, res) => {
    try {
        const { roomType } = req.params;

        if (!roomType) {
            console.log('Room type not provided');
            return res.status(400).json({ message: 'Room type is required' });
        }

        console.log('Fetching rooms of type:', roomType);
        const rooms = await RoomModel.find({ roomType });
        if (!rooms.length) {
            console.log('No rooms found for this room type');
            return res.status(404).json({ message: 'No rooms found for this room type' });
        }

        const roomIds = rooms.map(room => room._id);

        const bookings = await BookedRoomModel.find({
            roomId: { $in: roomIds }
        }).populate('roomId');

        if (!bookings.length) {
            console.log('No bookings found for these rooms');
            return res.status(200).json({
                success: true,
                data: {
                    roomType,
                    allRoomBookedDates: [],
                    commonBookedDates: [],
                },
            });
        }

        // Set current date to start of today
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Filter out bookings where checkout date is today or earlier
        const filteredBookings = bookings.filter(booking => {
            const checkOutDate = new Date(booking.checkOut);
            checkOutDate.setHours(0, 0, 0, 0);
            return checkOutDate > currentDate;
        });

        // Initialize bookedDates object for each room
        const bookingsByRoom = {};
        roomIds.forEach(roomId => {
            bookingsByRoom[roomId] = { bookedDates: new Set(), bookingDetails: [] };
        });

        // Fill in the booked dates and details for each room
        filteredBookings.forEach(booking => {
            const roomId = booking.roomId._id.toString();
            const roomNumber = booking.roomId.roomId;
            const checkInDate = new Date(booking.checkIn).toISOString().split('T')[0];
            const checkOutDate = new Date(booking.checkOut).toISOString().split('T')[0];

            // Add booked dates to the Set
            let currentDate = new Date(booking.checkIn);
            const endDate = new Date(booking.checkOut);

            while (currentDate < endDate) {
                bookingsByRoom[roomId].bookedDates.add(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Add booking details
            bookingsByRoom[roomId].bookingDetails.push({
                roomNumber,
                checkIn: checkInDate,
                checkOut: checkOutDate,
            });
        });

        // Convert Set to Array and format data
        const allRoomBookedDates = Object.entries(bookingsByRoom).map(([roomId, data]) => ({
            roomId,
            bookedDates: Array.from(data.bookedDates),
            bookingDetails: data.bookingDetails,
        }));

        // Log booking details for each room
        allRoomBookedDates.forEach(room => {
            console.log(`Room ID: ${room.roomId}`);
            room.bookingDetails.forEach(detail => {
                console.log(`Room Number: ${detail.roomNumber}, Check-In: ${detail.checkIn}, Check-Out: ${detail.checkOut}`);
            });
        });

        // Find dates that are common between all rooms
        const roomDateArrays = allRoomBookedDates.map(room => room.bookedDates);
        let commonBookedDates = [];

        if (roomDateArrays.length > 1) {
            // Find intersection of all booked dates
            commonBookedDates = roomDateArrays.reduce((commonDates, roomDates) =>
                commonDates.filter(date => roomDates.includes(date))
            );
        }

        console.log("Common Booked Dates:", commonBookedDates);

        res.status(200).json({
            success: true,
            data: {
                roomType,
                allRoomBookedDates,
                commonBookedDates,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booked dates for room type',
            error: error.message,
        });
    }
};

// Function to fetch available rooms based on date range and room type
export const getAvailableRooms = async (req, res) => {
    try {
        const { startDate, endDate, roomType, guests } = req.query;

        // Validate input dates
        if (!startDate || !endDate || !roomType || !guests) {
            return res.status(400).json({ message: "Missing required query parameters" });
        }

        const checkIn = new Date(startDate);
        const checkOut = new Date(endDate);

        // Validate date range
        if (checkIn >= checkOut || isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            return res.status(400).json({ message: "Invalid date range" });
        }

        // Find all available rooms
        const allRooms = await RoomModel.find({ availability: true });
        if (!allRooms.length) {
            return res.status(404).json({ message: "No rooms found" });
        }

        const roomIds = allRooms.map((room) => room._id);

        // Find booked rooms within the requested date range
        const bookedRooms = await BookedRoomModel.find({
            roomId: { $in: roomIds },
            $or: [
                { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } } // Overlapping booking check
            ]
        });

        // Create a set of booked room IDs
        const bookedRoomIds = new Set(bookedRooms.map((booking) => booking.roomId.toString()));

        // Filter rooms that are not booked
        let availableRooms = allRooms.filter((room) => !bookedRoomIds.has(room._id.toString()));

        // Prioritize requested room type
        const requestedRoomIndex = availableRooms.findIndex((room) => room.roomType === roomType);
        if (requestedRoomIndex > -1) {
            const [requestedRoom] = availableRooms.splice(requestedRoomIndex, 1);
            availableRooms.unshift(requestedRoom);
        }

        // Logging available rooms for debugging
        console.log("Available Rooms:");
        availableRooms.forEach((room) =>
            console.log(`Room ID: ${room._id}, Room Type: ${room.roomType}`)
        );

        res.status(200).json({ availableRooms });
    } catch (error) {
        console.error("Error fetching available rooms:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


// Get booking by confirmation code
export const getBookingByConfirmationCode = async (req, res) => {
    try {
        const confirmationCode = req.params.confirmationCode;
        console.log('Confirmation Code:', confirmationCode);

        if (!confirmationCode) {
            return res.status(400).json({ message: 'Confirmation code is required' });
        }

        const booking = await BookedRoomModel.findOne({ bookingConfirmationCode: confirmationCode }).populate('roomId');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found. Please check your confirmation code.' });
        }

        // Format response data to include all necessary booking information
        const bookingData = {
            _id: booking._id,
            confirmationCode: booking.bookingConfirmationCode,
            bookingId: booking.bookingId,
            status: booking.status || 'Confirmed', // Default to 'Confirmed' if status is not set
            guestName: booking.fullName,
            email: booking.email,
            phone: booking.phone,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            roomType: booking.roomId ? booking.roomId.roomType : 'N/A',
            roomNumber: booking.roomId ? booking.roomId.roomId : 'N/A',
            guests: booking.guests,
            totalPrice: booking.totalAmount,
            addons: booking.addons,
            cancellationPolicy: booking.roomId ? booking.roomId.cancellationPolicy : 'N/A',
            createdAt: booking.createdAt
        };

        res.status(200).json(bookingData);
    } catch (error) {
        console.error('Error retrieving booking by confirmation code:', error);
        res.status(500).json({
            message: 'Error retrieving booking',
            error: error.message
        });
    }
};

// Cancel booking by ID
export const cancelBookingById = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid booking ID' });
        }

        const booking = await BookedRoomModel.findById(id).session(session);

        if (!booking) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.status === 'Cancelled') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Booking has already been cancelled' });
        }
        // Update booking status instead of deleting
        booking.status = 'Cancelled';
        await booking.save({ session });

        // Update room availability status
        if (booking.roomId) {
            const room = await RoomModel.findById(booking.roomId).session(session);
            if (room) {
                room.isbooked = false;
                await room.save({ session });
            }
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: 'Booking has been successfully Cancelled',
            booking: {
                _id: booking._id,
                confirmationCode: booking.bookingConfirmationCode,
                status: 'Cancelled'
            }
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);

        await session.abortTransaction();
        session.endSession();

        res.status(500).json({
            message: 'Error cancelling booking',
            error: error.message
        });
    }
};