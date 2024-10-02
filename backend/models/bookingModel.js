const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        checkIn: { type: Date, required: true },
        checkOut: { type: Date, required: true },
        guests: { type: Number, required: true },
        specialRequests: { type: String },
        roomType: { type: String, required: true },
        roomId: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending'
        },
        Breakfast: { type: Number, default: 0 },
        Lunch: { type: Number, default: 0 },
        Dinner: { type: Number, default: 0 },
        Extra: { type: String },
    },
    {
        timestamps: true
    }
);

const BookingModel = mongoose.model('Booking', bookingSchema);

export default BookingModel;
