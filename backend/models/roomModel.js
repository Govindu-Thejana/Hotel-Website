import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: [true, 'Room ID is required'],
        unique: true,
        trim: true,
    },
    roomType: {
        type: String,
        required: [true, 'Room type is required'],
        enum: ['Single', 'Double', 'Suite', 'Deluxe Suite'],
    },
    description: {
        type: String,
        trim: true,
    },
    capacity: {
        type: Number,
        min: [1, 'Capacity must be at least 1 guest'],
    },
    size: {
        type: Number,
        default: 25,
        required: true
    },
    pricePerNight: {
        type: Number,
        min: [0, 'Price per night must be a positive number'],
    },
    availability: {
        type: Boolean,
        default: false,
    },
    amenities: {
        type: [String],
    },
    images: {
        type: [String],
    },
    cancellationPolicy: {
        type: String,
        default: "Free cancellation up to 24 hours before check-in.",
    }
}, {
    timestamps: true,
});

const RoomModel = mongoose.model("Room", roomSchema);

export default RoomModel;