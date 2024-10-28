const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');

// Create a new booking
router.post('/', async (req, res) => {
    try {
        const { roomId, checkIn, checkOut } = req.body;

        // Check if the room is available for the given dates
        const conflictingBooking = await Booking.findOne({
            roomId,
            $or: [
                { checkIn: { $lte: checkOut }, checkOut: { $gte: checkIn } },
                { checkIn: { $gte: checkIn, $lte: checkOut } },
                { checkOut: { $gte: checkIn, $lte: checkOut } }
            ]
        });

        if (conflictingBooking) {
            return res.status(400).json({ message: 'Room is not available for the selected dates' });
        }

        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('roomId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a booking status
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(updatedBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;