import express from 'express';
import {
    createBooking,
    getBooking,
    cancelBooking,
    checkRoomAvailability,
    getAllBookings,
    getBookedDatesByRoomType,

    getBookingByConfirmationCode,
    cancelBookingById,
    updateBookingStatus,
    getAvailableRooms

} from '../controllers/bookingController.js';
import { validateBookingData } from '../middleware/validateBooking.js';

const router = express.Router();

router.post('/bookings', validateBookingData, createBooking);
router.get('/bookings/:bookingId', getBooking);
router.delete('/bookings/:bookingId', cancelBooking);
router.get('/bookings/room/:roomType', getBookedDatesByRoomType); // Changed to avoid conflict
router.get('/availableRooms', getAvailableRooms);
router.get('/rooms/availability', checkRoomAvailability);
router.get('/bookings', getAllBookings);

router.get('/bookings/confirmation/:confirmationCode', getBookingByConfirmationCode);
router.put('/bookings/:id/cancel', cancelBookingById);
router.put('/bookings/status/:id', updateBookingStatus);


export default router;