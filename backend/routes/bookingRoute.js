import express from 'express';
import mongoose from 'mongoose';
import BookingModel from '../models/bookingModel';

const router = express.Router();

// GET all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await BookingModel.find({});
        return res.status(200).json({
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// GET a single booking by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Booking ID' });
        }

        const booking = await BookingModel.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        return res.status(200).json(booking);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// PUT update a booking
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Booking ID' });
        }

        const { name, email, phoneNumber, checkIn, checkOut, guests, specialRequests, roomType, roomId, status, Breakfast, Lunch, Dinner, Extra } = req.body;

        if (!name || !email || !phoneNumber || !checkIn || !checkOut || !guests || !roomType || !roomId) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const updatedBooking = await BookingModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        return res.status(200).send({ message: 'Booking updated successfully', booking: updatedBooking });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// DELETE a booking
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Booking ID' });
        }

        const deleteBooking = await BookingModel.findByIdAndDelete(id);
        if (!deleteBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        return res.status(200).json({ message: 'Booking deleted successfully', booking: deleteBooking });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// POST create a new booking
router.post('/', async (req, res) => {
    try {
        const { name, email, phoneNumber, checkIn, checkOut, guests, specialRequests, roomType, roomId, status, Breakfast, Lunch, Dinner, Extra } = req.body;

        if (!name || !email || !phoneNumber || !checkIn || !checkOut || !guests || !roomType || !roomId) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const newBooking = new BookingModel({
            name,
            email,
            phoneNumber,
            checkIn,
            checkOut,
            guests,
            specialRequests,
            roomType,
            roomId,
            status,
            Breakfast,
            Lunch,
            Dinner,
            Extra
        });

        const booking = await newBooking.save();
        return res.status(201).send(booking);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

export default router;