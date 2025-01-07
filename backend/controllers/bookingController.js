import RoomModel from '../models/roomModel.js';
import BookedRoomModel from '../models/bookedRoomModel.js';
import { generateBookingId, generateConfirmationCode } from '../middleware/generators.js';
import moment from 'moment';

// Function to create a new booking
export const createBooking = async (req, res) => {
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
        console.log(req.body);

        // Create bookings for each item in the cart
        const bookings = [];
        for (const item of cart) {
            const { room, checkIn, checkOut, guests, totalAmount, addons } = item;
            console.log(item.room.roomId, item.checkIn, item.checkOut);

            // Find room by ID
            const roomRecord = await RoomModel.findById(room._id);
            if (!roomRecord) {
                return res.status(404).json({ message: 'Room not found' });
            }

            // Adjust check-in and check-out dates
            const adjustedCheckIn = moment(checkIn, "MM/DD/YYYY").add(1, 'days').toDate();
            const adjustedCheckOut = moment(checkOut, "MM/DD/YYYY").add(1, 'days').toDate();

            // Check if room is already booked for the given dates
            const existingBooking = await BookedRoomModel.findOne({
                roomId: room._id,
                bookedDates: {
                    $elemMatch: {
                        $gte: checkIn,
                        $lt: checkOut
                    }
                }
            });

            if (existingBooking) {
                return res.status(400).json({
                    message: `Room ${room.roomId} is not available for the selected dates`
                });
            }

            // Generate bookedDates array (from adjusted check-in to one day before adjusted check-out)
            const bookedDates = [];
            let currentDate = adjustedCheckIn;
            while (currentDate < checkOut) {
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
                address: {
                    country,
                    address1,
                    city,
                    zipCode
                },
                totalAmount,
                addons,
                bookingConfirmationCode: generateConfirmationCode()
            });

            // Save booking
            await booking.save();
            bookings.push(booking);

            // Update room status
            roomRecord.isbooked = true;
            await roomRecord.save();
        }

        // Send response after all bookings are created
        res.status(201).json({
            message: 'Booking created successfully',
            bookings
        });
    } catch (error) {
        // Log the error and send a single error response
        console.error("Error creating booking:", error);
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
        const { startDate, endDate, roomType, guests } = req.query;

        // Validate input dates
        if (!startDate || !endDate || !roomType || !guests) {
            return res.status(400).json({ message: 'Missing required query parameters' });
        }

        // Convert dates to Date objects
        const checkIn = new Date(startDate);
        const checkOut = new Date(endDate);

        // Validate date range
        if (checkIn >= checkOut || isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            return res.status(400).json({ message: 'Invalid date range' });
        }

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

            // Check if the room is already booked for the given dates
            const existingBooking = await BookedRoomModel.findOne({
                roomId: room._id,
                $or: [
                    {
                        checkIn: { $lte: checkOut },
                        checkOut: { $gte: checkIn }
                    }
                ]
            });

            // Room is available if no booking exists for the requested dates or if there are no bookings at all
            if (!existingBooking) {
                availableRooms.push(room);
                console.log(`Availble rooms :Room ID: ${room.roomId}, Room Type: ${room.roomType}`);
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
        console.error('Error fetching available rooms:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
