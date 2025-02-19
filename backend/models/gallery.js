import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    title:
    {
        type: String,
        required: true
    },
    description:
        { type: String },
    imageUrl:
        { type: String, required: true }, // Cloudinary URL
    category:
    {
        type: String,
        enum: ["Accommodation", "Dining", "Wedding"],
        default: "Others",
    },
    uploadDate: { type: Date, default: Date.now },
});

const GalleryModel = mongoose.model("Gallery", gallerySchema);

export default GalleryModel;