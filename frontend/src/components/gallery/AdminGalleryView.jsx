import React, { useState, useEffect } from "react";
import { fetchAllImages } from "./GalleryCrudApi"; // Ensure this is the correct path

const AdminRoomView = () => {
    const [images, setImages] = useState([]); // To store fetched images
    const [filteredImages, setFilteredImages] = useState([]); // To store filtered images based on category
    const [loading, setLoading] = useState(true); // For loading state
    const [selectedCategory, setSelectedCategory] = useState("All"); // Store selected category

    // Fetch all images when the component mounts
    useEffect(() => {
        const getImages = async () => {
            try {
                const data = await fetchAllImages(); // Fetch all images (no filter)
                setImages(data); // Store fetched images in state
                setFilteredImages(data); // Default show all images
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error("Error fetching images:", error);
                setLoading(false); // Stop loading even if there's an error
            }
        };

        getImages();
    }, []); // Run this effect once when the component mounts

    // Handle category filtering
    useEffect(() => {
        if (selectedCategory === "All") {
            setFilteredImages(images); // Show all images when "All" is selected
        } else {
            // Filter images based on the selected category
            const filtered = images.filter((image) => image.category === selectedCategory);
            setFilteredImages(filtered); // Store filtered images
        }
    }, [selectedCategory, images]); // This will run whenever the category or images change

    const handleCategoryClick = (category) => {
        setSelectedCategory(category); // Set selected category to filter images
    };

    if (loading) {
        return <div>Loading...</div>; // Show loading message while fetching
    }

    return (
        <div>
            <div className="flex items-center justify-center py-4 md:py-8 flex-wrap">
                {/* Category Buttons */}
                <button
                    onClick={() => handleCategoryClick("All")}
                    className={`text-gray-700 hover:text-white border border-gray-300 bg-gray-100 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 ${selectedCategory === "All" ? "bg-blue-600 text-gray" : ""}`}
                >
                    All
                </button>
                <button
                    onClick={() => handleCategoryClick("Accommodation")}
                    className={`text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 ${selectedCategory === "Accommodation" ? "bg-blue-700 text-gray" : ""
                        }`}
                >
                    Accommodation
                </button>
                <button
                    onClick={() => handleCategoryClick("Dining")}
                    className={`text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 ${selectedCategory === "Dining" ? "bg-blue-700 text-gray" : ""
                        }`}
                >
                    Dining
                </button>
                <button
                    onClick={() => handleCategoryClick("Wedding")}
                    className={`text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 ${selectedCategory === "Wedding" ? "bg-blue-700 text-gray" : ""
                        }`}
                >
                    Wedding
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Render filtered images based on the selected category */}
                {filteredImages.map((image) => (
                    <div key={image._id}>
                        <img
                            className="h-auto max-w-full rounded-lg"
                            src={image.imageUrl} // Use the image URL from the API
                            alt={image.title}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminRoomView;
