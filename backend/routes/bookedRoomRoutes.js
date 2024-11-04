import express from 'express';
import {
    createBooking,
    getBooking,
    cancelBooking,
    checkRoomAvailability,
    getAllBookings
} from '../controllers/bookingController.js';
import { validateBookingData } from '../middleware/validateBooking.js';

const router = express.Router();

router.post('/bookings', validateBookingData, createBooking);
router.get('/bookings/:bookingId', getBooking);
router.delete('/bookings/:bookingId', cancelBooking);
router.get('/rooms/availability', checkRoomAvailability);
router.get('/bookings', getAllBookings);

export default router;