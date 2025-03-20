import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        required: true,
        unique: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    fullName: {
        type: String,
        required: [true, 'Full Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email address is required'],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    checkIn: {
        type: Date,
        required: [true, 'Check-in date is required'],
    },
    checkOut: {
        type: Date,
        required: [true, 'Check-out date is required'],
    },
    bookedDates: [{
        type: Date,
        required: true
    }],
    guests: {
        adults: {
            type: Number,
            min: [1, 'At least one adult guest is required'],
            required: true,
        },
        children: {
            type: Number,
            default: 0,
        }
    },
    specialRequests: {
        type: String,
        trim: true,
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: [0, 'Total amount must be positive'],
    },
    status: {
        type: String,
        enum: ['Confirmed', 'Cancelled', 'Completed'],
        default: 'Confirmed',
        required: true
    },
    addons: [{
        type: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: [0, 'Addon price must be positive']
        }
    }],
    bookingConfirmationCode: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

const BookedRoomModel = mongoose.model("BookedRoom", bookingSchema);

export default BookedRoomModel;
