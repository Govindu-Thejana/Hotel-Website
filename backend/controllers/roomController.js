import RoomModel from '../models/roomModel.js';// Import your Room model
import mongoose from 'mongoose';  // Import Mongoose for MongoDB interactions.
import fs from 'fs';
import path from 'path';

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
            availability, amenities, cancellationPolicy, existingImages,
        } = req.body;

        // Handle images
        const uploadedImages = req.files?.map((file) => file.path) || [];
        const finalImages = [
            ...(existingImages ? JSON.parse(existingImages) : []),
            ...uploadedImages,
        ];

        // Process amenities input
        let processedAmenities;
        if (amenities) {
            if (Array.isArray(amenities) && amenities.length === 1 && typeof amenities[0] === 'string') {
                // Handle case: ["[\"Air Conditioning\",\"Hot Water\",\"WiFi\"]"]
                try {
                    processedAmenities = JSON.stringify(JSON.parse(amenities[0])); // Parse and re-stringify the JSON string
                } catch {
                    processedAmenities = JSON.stringify(amenities); // Fallback if the inner string isn't valid JSON
                }
            } else if (typeof amenities === 'string' && amenities.trim().startsWith('[')) {
                // Handle case: "[\"Air Conditioning\",\"Hot Water\",\"WiFi\"]"
                processedAmenities = amenities; // Assume it's a valid JSON string
            } else {
                // Convert arrays or other data to JSON strings
                processedAmenities = JSON.stringify(amenities);
            }
        }

        // Prepare update fields
        const updateFields = {
            ...(roomId && { roomId }),
            ...(roomType && { roomType }),
            ...(description && { description }),
            ...(capacity && { capacity }),
            ...(pricePerNight && { pricePerNight }),
            ...(availability && { availability }),
            ...(processedAmenities && { amenities: processedAmenities }), // Store as JSON string
            ...(cancellationPolicy && { cancellationPolicy }),
            images: finalImages,
        };

        // Update the room
        const room = await RoomModel.findByIdAndUpdate(id, updateFields, { new: true });

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json(room);
    } catch (err) {
        console.error("Error updating room:", err);
        res.status(500).json({ message: 'Server error, please try again.' });
    }
};


export const deleteRoomById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Room ID' });
        }

        // Find the room to delete
        const room = await RoomModel.findById(id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Delete associated images from the file system
        if (Array.isArray(room.images)) {
            room.images.forEach((imagePath) => {
                const fullPath = path.resolve(imagePath);
                fs.unlink(fullPath, (err) => {
                    if (err) console.error(`Failed to delete image: ${fullPath}`, err);
                });
            });
        }

        // Delete the room from the database
        await RoomModel.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

