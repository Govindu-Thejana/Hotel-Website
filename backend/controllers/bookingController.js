import RoomModel from '../models/roomModel.js';
import BookedRoomModel from '../models/bookedRoomModel.js';
import { generateBookingId, generateConfirmationCode } from '../middleware/generators.js';

// Function to create a new booking
export const createBooking = async (req, res) => {
    try {
        const {
            roomId,
            fullName,
            email,
            phone,
            checkIn,
            checkOut,
            guests,
            specialRequests
        } = req.body;

        // Check if room exists
        const room = await RoomModel.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Check if room is already booked for the given dates
        const existingBooking = await BookedRoomModel.findOne({
            roomId,
            $or: [
                {
                    checkIn: { $lte: new Date(checkOut) },
                    checkOut: { $gte: new Date(checkIn) }
                }
            ]
        });

        if (existingBooking) {
            return res.status(400).json({
                message: 'Room is not available for the selected dates'
            });
        }

        // Calculate total amount
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const numberOfNights = Math.ceil(
            (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const totalAmount = numberOfNights * room.pricePerNight;

        // Generate bookedDates array (from check-in to one day before check-out)
        const bookedDates = [];
        let currentDate = new Date(checkInDate);
        while (currentDate < checkOutDate) {
            bookedDates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Create new booking
        const booking = new BookedRoomModel({
            bookingId: generateBookingId(),
            roomId,
            fullName,
            email,
            phone,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            bookedDates,
            guests,
            specialRequests,
            totalAmount,
            bookingConfirmationCode: generateConfirmationCode()
        });

        // Update room status
        room.isBooked = true;
        await room.save();

        // Save booking
        await booking.save();

        res.status(201).json({
            message: 'Booking created successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({
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
        const { startDate, endDate, roomType } = req.query;

        // Convert dates to Date objects
        const checkInDate = new Date(startDate);
        const checkOutDate = new Date(endDate);

        // Find all rooms
        const rooms = await RoomModel.find({});
        if (!rooms.length) {
            return res.status(404).json({ message: 'No rooms found' });
        }

        // Filter rooms based on their availability
        const availableRooms = [];
        for (const room of rooms) {
            if (!room.availability) {
                continue; // Skip room if it is not available
            }

            // Check if any of the dates between checkIn and checkOut exist in bookedDates
            const existingBooking = await BookedRoomModel.findOne({
                roomId: room._id,
                bookedDates: {
                    $elemMatch: {
                        $gte: checkInDate,
                        $lt: checkOutDate
                    }
                }
            });

            // Room is available if no booking exists for the requested dates
            if (!existingBooking) {
                availableRooms.push(room);
            }
        }

        // Ensure the first room is of the requested room type if available
        const requestedRoomIndex = availableRooms.findIndex(room => room.roomType === roomType);
        if (requestedRoomIndex > -1) {
            const [requestedRoom] = availableRooms.splice(requestedRoomIndex, 1);
            availableRooms.unshift(requestedRoom);
        }

        res.status(200).json({ availableRooms });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching available rooms',
            error: error.message
        });
    }
};


