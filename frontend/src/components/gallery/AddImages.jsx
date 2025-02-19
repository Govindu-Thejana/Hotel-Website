import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is installed: npm install axios
import { fetchAllImages, addImage, deleteImage } from './GalleryCrudApi'; // Import API functions
import Alert from '@mui/material/Alert'; // Import the Alert component from Material UI

const AddImages = () => {
    const [imageData, setImageData] = useState({
        title: '',
        description: '',
        category: '',
        image: null,
    });

    const [galleryImages, setGalleryImages] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const images = await fetchAllImages();
            setGalleryImages(images);
        } catch (error) {
            console.error('Error fetching gallery images:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setImageData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageData((prev) => ({ ...prev, image: file }));
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageData.title || !imageData.description || !imageData.category || !imageData.image) {
            setAlertMessage({ message: 'All fields are required.', severity: 'error' });
            return;
        }

        const formData = new FormData();
        formData.append('title', imageData.title);
        formData.append('description', imageData.description);
        formData.append('category', imageData.category);
        formData.append('image', imageData.image);

        try {
            setIsSubmitting(true);
            await addImage(formData);
            setAlertMessage({ message: 'Image uploaded successfully!', severity: 'success' });
            setImageData({ title: '', description: '', category: '', image: null });
            setPreview(null);
            fetchImages();
        } catch (error) {
            setAlertMessage({ message: 'Failed to upload image.', severity: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        try {
            await deleteImage(id);
            setAlertMessage({ message: 'Image deleted successfully!', severity: 'success' });
            fetchImages();
        } catch (error) {
            setAlertMessage({ message: 'Failed to delete image.', severity: 'error' });
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload Gallery Image</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={imageData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={imageData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
                <select
                    name="category"
                    value={imageData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                >
                    <option value="">Select Category</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Dining">Dining</option>
                    <option value="Accommodation">Accommodation</option>
                </select>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                    required
                />
                {preview && <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-md mt-2" />}
                <button
                    type="submit"
                    className={`px-6 py-2 rounded-md text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Uploading...' : 'Upload Image'}
                </button>
                {alertMessage && (
                    <Alert severity={alertMessage.severity} className="mt-4">
                        {alertMessage.message}
                    </Alert>
                )}
            </form>
            <h3 className="text-xl font-bold mt-6">Gallery Images</h3>
            <div className="grid grid-cols-3 gap-4 mt-4">
                {galleryImages.map((image) => (
                    <div key={image._id} className="relative">
                        <img src={image.imageUrl} alt={image.title} className="w-full h-40 object-cover rounded-md" />
                        <p className="text-sm text-center mt-2">{image.title}</p>
                        <button
                            onClick={() => handleDelete(image._id)}
                            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded-md"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddImages;
