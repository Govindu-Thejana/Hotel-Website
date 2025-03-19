import { DateTime } from "luxon";
export const validateBookingData = (req, res, next) => {
    const {
        prefix,
        firstName,
        lastName,
        phone,
        email,
        country,
        address1,
        city,
        zipCode,
        cart
    } = req.body;

    if (!prefix || !firstName || !lastName || !phone || !email || !country || !cart) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }
    // Validate cart is not empty
    if (cart.length === 0) {
        return res.status(400).json({
            message: 'Cart cannot be empty'
        });
    }
    // Validate each cart item
    for (const item of cart) {
        const { room, checkIn, checkOut, guests } = item;
        if (!room || !checkIn || !checkOut || !guests) {
            return res.status(400).json({
                message: 'Missing required fields in cart items'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format'
            });
        }

        // Validate dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // Add 1 day to the dates because using new date() will set the checkin and checkout dates to prevous day of them
        checkInDate.setDate(checkInDate.getDate() + 1);
        checkOutDate.setDate(checkOutDate.getDate() + 1);
        const todayColombo = DateTime.now().setZone("Asia/Colombo").startOf("day"); //get today date using luxon library

        if (checkInDate < todayColombo) {
            return res.status(400).json({
                message: 'Check-in date cannot be in the past'
            });
        }

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({
                message: 'Check-out date must be after check-in date'
            });
        }

        // Validate guests number
        if (guests < 1) {
            return res.status(400).json({
                message: 'Number of guests must be at least 1'
            });
        }
        console.log('Validation successful');

    }
    next();

}