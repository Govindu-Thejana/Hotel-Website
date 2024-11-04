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

        // Create new booking
        const booking = new BookedRoomModel({
            bookingId: generateBookingId(),
            roomId,
            fullName,
            email,
            phone,
            checkIn: checkInDate,
            checkOut: checkOutDate,
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
