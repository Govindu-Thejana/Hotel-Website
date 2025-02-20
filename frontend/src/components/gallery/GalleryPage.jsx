import React, { useState, useEffect } from "react";
import { fetchAllImages } from "./GalleryCrudApi"; // Ensure the correct path to API functions

const GalleryPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getImages = async () => {
            try {
                const data = await fetchAllImages(); // Fetch images from the backend
                setImages(data);
                setFilteredImages(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching images:", error);
                setLoading(false);
            }
        };
        getImages();
    }, []);

    useEffect(() => {
        if (selectedCategory === "All") {
            setFilteredImages(images);
        } else {
            setFilteredImages(images.filter(image => image.category === selectedCategory));
        }
    }, [selectedCategory, images]);

    const categories = ["All", "Accommodation", "Dining", "Wedding"];

    if (loading) {
        return <div className="text-center p-10">Loading...</div>;
    }

    return (
        <div className="min-h-screen pt-10 bg-gray-50">

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex space-x-4 justify-center mb-6">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`py-2 px-4 rounded-full transition duration-300 whitespace-nowrap ${selectedCategory === category
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-400"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredImages.map((image) => (
                        <div key={image._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <img className="w-full h-64 object-cover" src={image.imageUrl} alt={image.title} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GalleryPage;
