import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Plus } from "lucide-react"; // Import Plus icon
import { fetchAllImages } from "./GalleryCrudApi"; // Ensure this is the correct path

const AdminRoomView = () => {
    const [images, setImages] = useState([]); // Store fetched images
    const [filteredImages, setFilteredImages] = useState([]); // Store filtered images
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedCategory, setSelectedCategory] = useState("All"); // Selected category
    const navigate = useNavigate(); // Initialize navigate function

    // Fetch images when component mounts
    useEffect(() => {
        const getImages = async () => {
            try {
                const data = await fetchAllImages(); // Fetch images
                setImages(data);
                setFilteredImages(data); // Default: Show all images
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setLoading(false); // Stop loading after fetch
            }
        };

        getImages();
    }, []);

    // Update filtered images when category changes
    useEffect(() => {
        if (selectedCategory === "All") {
            setFilteredImages(images);
        } else {
            setFilteredImages(images.filter((image) => image.category === selectedCategory));
        }
    }, [selectedCategory, images]);

    // Handle category selection
    const handleCategoryClick = (category) => setSelectedCategory(category);

    // Navigate to add new image page
    const handleNavigateAddImage = () => navigate("/add-newimages");

    if (loading) return <div>Loading...</div>;

    return (
        <section className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-800">Gallery</h1>
                    <button
                        onClick={handleNavigateAddImage}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={16} />
                        <span>Add New Images</span>
                    </button>
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex items-center justify-center py-4 md:py-8 flex-wrap">
                {["All", "Accommodation", "Dining", "Wedding"].map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`border border-gray-300 bg-gray-100 hover:bg-blue-600 text-gray-700 hover:text-white focus:ring-4 focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 me-3 mb-3 ${selectedCategory === category ? "bg-blue-600 text-white" : ""
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredImages.map((image) => (
                    <div key={image._id}>
                        <img className="h-auto max-w-full rounded-lg" src={image.imageUrl} alt={image.title} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AdminRoomView;
