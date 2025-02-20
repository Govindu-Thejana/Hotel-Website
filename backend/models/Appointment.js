import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true, // Ensures there are no leading/trailing spaces
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true, // Ensures there are no leading/trailing spaces
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  options: [
    {
      date: Date,
      time: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  cancelledAt: {
    type: Date,
  },
  confirmedAt: {
    type: Date,
  },
});

export default mongoose.model("Appointment", appointmentSchema);