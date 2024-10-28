import express from 'express';
import mongoose from 'mongoose';
import RoomModel from '../models/roomModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const rooms = await RoomModel.find({});
        return res.status(200).json({
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Room ID' });
        }

        const room = await RoomModel.findById(id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        return res.status(200).json(room);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Room ID' });
        }

        const { roomId, roomType, description, capacity, pricePerNight, availability, amenities, images, checkInTime, checkOutTime, cancellationPolicy } = req.body;

        if (!roomId || !roomType || !description || !capacity || !pricePerNight || availability === undefined || !amenities || !images) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const updatedRoom = await RoomModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }

        return res.status(200).send({ message: 'Room updated successfully', room: updatedRoom });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Room ID' });
        }

        const deleteRoom = await RoomModel.findByIdAndDelete(id);
        if (!deleteRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }

        return res.status(200).json({ message: 'Room deleted successfully', room: deleteRoom });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { roomId, roomType, description, capacity, pricePerNight, availability, amenities, images, cancellationPolicy } = req.body;


        const newRoom = new RoomModel({
            roomId,
            roomType,
            description,
            capacity,
            pricePerNight,
            availability,
            amenities,
            images,
            cancellationPolicy
        });

        const room = await newRoom.save();  // Use .save() instead of create() for a Mongoose document
        return res.status(201).send(room);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

export default router;
