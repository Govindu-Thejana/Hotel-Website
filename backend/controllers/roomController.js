import RoomModel from '../models/roomModel.js';// Import your Room model
import mongoose from 'mongoose';  // Import Mongoose for MongoDB interactions.

// Controller to create a room
export const createRoom = async (req, res) => {
    try {
        const { roomId, roomType, description, capacity, pricePerNight, availability, amenities, cancellationPolicy } = req.body;

        // Handle uploaded files (if any)
        const images = req.files ? req.files.map(file => file.path) : []; // Get uploaded image paths

        // Create a new room with the provided data
        const newRoom = new RoomModel({
            roomId,
            roomType,
            description,
            capacity,
            pricePerNight,
            availability,
            amenities,
            images, // Save image paths
            cancellationPolicy
        });

        const room = await newRoom.save(); // Save to the database
        res.status(201).send(room); // Return the created room
    } catch (error) {
        console.error(error.message); // Log errors
        res.status(500).send({ message: error.message }); // Return 500 on server error
    }
};
// Fetch room by custom roomId
export const getRoomByRoomId = async (req, res) => {
    const { roomId } = req.params;
    try {
        const room = await RoomModel.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Fetch room by MongoDB ObjectId
export const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Room ID' });
        }

        const room = await RoomModel.findById(id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json(room);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};


// Get all rooms
export const getAllRooms = async (req, res) => {
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
};

// Update a room by ID
export const updateRoomById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Room ID' });
        }

        const {
            roomId, roomType, description, capacity, pricePerNight,
            availability, amenities, images, checkInTime, checkOutTime,
            cancellationPolicy
        } = req.body;

        // Check for required fields
        if (!roomId || !roomType || !description || !capacity || !pricePerNight ||
            availability === undefined || !amenities || !images) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const updatedRoom = await RoomModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }

        return res.status(200).json({ message: 'Room updated successfully', room: updatedRoom });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Delete a room by ID
export const deleteRoomById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
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
};
