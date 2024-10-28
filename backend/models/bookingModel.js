import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, default: 1 },
    specialRequests: { type: String, default: 'None' },
    roomType: { type: String, required: true },
    roomId: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    Breakfast: { type: Number, required: false },
    Lunch: { type: Number, required: false },
    Dinner: { type: Number, required: false },
    Extra: { type: String, required: false },

}, { timestamps: true });

const BookingModel = mongoose.model('Booking', bookingSchema);
export default BookingModel;
