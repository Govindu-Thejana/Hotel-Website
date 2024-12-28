import express from 'express';  // Import the Express framework to handle routing and requests.

import upload from '../middleware/fileUploadMiddleware.js'; // Import renamed middleware
import { createRoom, getRoomById, getRoomByRoomId, getAllRooms, updateRoomById, deleteRoomById } from '../controllers/roomController.js'; // Import room controller


const router = express.Router();  // Create a new Express router instance.

/* // Route to get all rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await RoomModel.find({});  // Fetch all room documents from the database.
        return res.status(200).json({
            count: rooms.length,  // Return count of rooms
            data: rooms  // Return all room data
        });
    } catch (error) {
        console.log(error.message);  // Log any errors to the console.
        res.status(500).send({ message: error.message });  // Return a 500 status with the error message.
    }
}); */

// Route to get a specific room by ID
/* router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;  // Extract room ID from request parameters.

        // Check if ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Room ID' });  // Return 400 if ID is invalid.
        }

        const room = await RoomModel.findById(id);  // Try to find the room by its ID.
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });  // Return 404 if room is not found.
        }

        return res.status(200).json(room);  // Return room data if found.
    } catch (error) {
        console.log(error.message);  // Log any errors.
        res.status(500).send({ message: error.message });  // Return 500 on server error.
    }
}); */

/* // Route to update a room by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;  // Extract the room ID.

        // Validate the ObjectId to ensure it’s a valid MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Room ID' });
        }

        // Destructure and validate necessary fields from the request body
        const { roomId, roomType, description, capacity, pricePerNight, availability, amenities, images, checkInTime, checkOutTime, cancellationPolicy } = req.body;

        // Check if all required fields are provided
        if (!roomId || !roomType || !description || !capacity || !pricePerNight || availability === undefined || !amenities || !images) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        // Update the room with the given ID and new data
        const updatedRoom = await RoomModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });  // Return 404 if room not found.
        }

        return res.status(200).send({ message: 'Room updated successfully', room: updatedRoom });  // Return success message.
    } catch (error) {
        console.log(error.message);  // Log any errors.
        res.status(500).send({ message: error.message });  // Return 500 on server error.
    }
}); */

/* // Route to delete a room by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;  // Extract the room ID.

        // Validate the ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Room ID' });
        }

        const deleteRoom = await RoomModel.findByIdAndDelete(id);  // Delete the room with the specified ID.
        if (!deleteRoom) {
            return res.status(404).json({ message: 'Room not found' });  // Return 404 if room not found.
        }

        return res.status(200).json({ message: 'Room deleted successfully', room: deleteRoom });  // Return success message.
    } catch (error) {
        console.log(error.message);  // Log errors.
        res.status(500).send({ message: error.message });  // Return 500 on server error.
    }
}); */

/* // Route to create a new room
router.post('/', async (req, res) => {
    try {
        // Destructure the required room fields from the request body
        const { roomId, roomType, description, capacity, pricePerNight, availability, amenities, images, cancellationPolicy } = req.body;

        // Create a new instance of RoomModel with the provided data
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

        const room = await newRoom.save();  // Save the new room to the database.
        return res.status(201).send(room);  // Return the created room data.
    } catch (error) {
        console.log(error.message);  // Log errors.
        res.status(500).send({ message: error.message });  // Return 500 on server error.
    }
}); */

/* router.get('/search/:roomId', async (req, res) => {
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
}); */


// Route to create a room with file upload
router.post('/withfileupload', upload.array('images', 5), createRoom); // Allow up to 5 images

// Route for fetching room by custom roomId
router.get('/search/:roomId', getRoomByRoomId);

// Route for fetching room by MongoDB ObjectId
router.get('/:id', getRoomById);

// Route to get all rooms
router.get('/', getAllRooms);

// Route to update a room by ID
router.put('/:id', upload.array('images', 5), updateRoomById);

// Route to delete a room by ID
router.delete('/:id', deleteRoomById);

export default router;  // Export the router to be used in other parts of the application.
