import mongoose, { Schema } from "mongoose";

const WeddingSchema = new mongoose.Schema({
    packageName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    servicesIncluded: {
        type: [String], // Array of strings to list included services
        required: true
    },
    description: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        default: true // Default to available
    },
    date: {
        type: Date,
        default: Date.now // Automatically set the date to the current time
    }
});

const WeddingPackageModel = mongoose.model("WeddingPackage", WeddingSchema);
export default WeddingPackageModel;
