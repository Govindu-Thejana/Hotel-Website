import express from "express";
import { uploadGallery } from "../cloudinaryconfig.js"; // Uses Gallery-specific upload
import {
    addImage,
    getAllImages,
    getImageById,
    deleteImage,
    updateImage,
} from "../controllers/galleryController.js";

const router = express.Router();

// 🔹 Upload a new image
router.post("/", uploadGallery.single("image"), addImage);

// 🔹 Get all images
router.get("/", getAllImages);

// 🔹 Get a single image by ID
router.get("/:id", getImageById);

// 🔹 Delete an image by ID
router.delete("/:id", deleteImage);

// 🔹 Update image details (optionally update the image itself)
router.put("/:id", uploadGallery.single("image"), updateImage);

export default router;
