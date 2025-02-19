import GalleryModel from "../models/gallery.js";

// Upload image
export const addImage = async (req, res) => {
  try {
    const newImage = new GalleryModel({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.file.path, // ✅ Cloudinary URL
      category: req.body.category,
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading image", error: err });
  }
};

// Get all images
export const getAllImages = async (req, res) => {
  try {
    const images = await GalleryModel.find();
    res.status(200).json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching images", error: err });
  }
};

// Get image by ID
export const getImageById = async (req, res) => {
  try {
    const image = await GalleryModel.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    res.status(200).json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching image", error: err });
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const image = await GalleryModel.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    await image.deleteOne(); // ✅ Deletes from MongoDB
    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting image", error: err });
  }
};

// Update image (only metadata, unless a new image is uploaded)
export const updateImage = async (req, res) => {
  try {
    const existingImage = await GalleryModel.findById(req.params.id);
    if (!existingImage) return res.status(404).json({ message: "Image not found" });

    const updatedData = {
      title: req.body.title || existingImage.title,
      description: req.body.description || existingImage.description,
      category: req.body.category || existingImage.category,
    };

    if (req.file) {
      updatedData.imageUrl = req.file.path; // ✅ Replace image with new upload
    }

    const updatedImage = await GalleryModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updatedImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating image", error: err });
  }
};
