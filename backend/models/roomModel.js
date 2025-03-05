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
        required: [true, 'Room type is required']

    },
    description: {
        type: String,
        trim: true,
    },
    capacity: {
        type: Number,
        min: [1, 'Capacity must be at least 1 guest'],
    },
    pricePerNight: {
        type: Number,
        min: [0, 'Price per night must be a positive number'],
    },
    availability: {
        type: Boolean,
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
    },
    isbooked: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

const RoomModel = mongoose.model("Room", roomSchema);

export default RoomModel;