import express from 'express';  // Import the Express framework to handle routing and requests.

import { createRoom, getRoomById, getRoomByRoomId, getAllRooms, updateRoomById, deleteRoomById }
    from '../controllers/roomController.js'; // Import room controller

import upload from '../cloudinaryconfig.js';

const router = express.Router();  // Create a new Express router instance.


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
