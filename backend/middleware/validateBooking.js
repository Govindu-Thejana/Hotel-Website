export const validateBookingData = (req, res, next) => {
    const {
        roomId,
        fullName,
        email,
        phone,
        checkIn,
        checkOut,
        guests
    } = req.body;

    if (!roomId || !fullName || !email || !phone || !checkIn || !checkOut || !guests) {
        return res.status(400).json({
            message: 'Missing required fields'
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
    const today = new Date();

    if (checkInDate < today) {
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

    next();
};