import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'HotelSuneragira', // Cloudinary folder
        format: async (req, file) => file.mimetype.split('/')[1], // Preserve original format
        public_id: (req, file) => Date.now() + '-' + file.originalname.replace(/\s+/g, '_'), // Unique ID
    },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });

export default upload;

// 🔹 Gallery Image Upload Configuration (stores in HotelSuneragira/Gallery/)
const galleryStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "HotelSuneragira/Gallery", // ✅ Gallery images go here
        format: file.mimetype.split("/")[1], // Keep original format
        public_id: Date.now() + "-" + file.originalname.replace(/\s+/g, "_"),
    }),
});
export const uploadGallery = multer({ storage: galleryStorage });


