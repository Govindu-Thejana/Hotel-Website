import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Update.css';

const categories = [
    "Salad",
    "Rolls",
    "Deserts",
    "Sandwich",
    "Cake",
    "Pure Veg",
    "Pasta",
    "Noodles"
];

const UpdateProduct = ({ url }) => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        image: '', // To store the new image file
        imageUrl: '', // To store the URL of the current image
    });

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${url}/api/products/${productId}`);
            if (response.data.success) {
                setProduct({
                    name: response.data.product.name,
                    description: response.data.product.description,
                    category: response.data.product.category,
                    price: response.data.product.price,
                    imageUrl: response.data.product.image,
                });
            } else {
                toast.error("Error fetching product: " + response.data.message);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Failed to fetch product. Please check your connection.");
        }
    };

    const updateProduct = async (e) => {
        e.preventDefault();
        try {
            let imageToUpload = product.image;
            let imageUrl = product.imageUrl;

            if (imageToUpload) {
                // Upload new image to Cloudinary
                const formData = new FormData();
                formData.append("file", imageToUpload);
                formData.append("upload_preset", "Restaurant"); // Your upload preset
                formData.append("cloud_name", "dgdkvmijt"); // Your Cloudinary cloud name

                const res = await fetch("https://api.cloudinary.com/v1_1/dgdkvmijt/image/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    const errorResponse = await res.json();
                    throw new Error(`Error uploading image: ${errorResponse.error.message}`);
                }

                const uploadedImageURL = await res.json();
                imageUrl = uploadedImageURL.secure_url;
            }

            // Update product data
            const productData = {
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                image: imageUrl, // Use the uploaded image URL or the existing one
            };

            const response = await axios.put(`${url}/api/products/${productId}`, productData);

            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/list'); // Navigate back to the list page
            } else {
                toast.error("Error updating product");
            }
        } catch (error) {
            console.error("Update Error:", error);
            toast.error("Failed to update product");
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleCategoryChange = (e) => {
        setProduct({ ...product, category: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProduct(prevProduct => ({
                ...prevProduct,
                image: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setProduct(prevProduct => ({
                    ...prevProduct,
                    imageUrl: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="update-container">
            <header className="update-header">
                <h2 className="update-title">Update Product</h2>
            </header>
            <main className="update-content">
                <form onSubmit={updateProduct} className="update-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Product Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={product.name}
                                onChange={handleInputChange}
                                placeholder="Enter product name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Product Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={product.description}
                                onChange={handleInputChange}
                                placeholder="Enter product description"
                                rows="6"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category:</label>
                            <select
                                id="category"
                                name="category"
                                value={product.category}
                                onChange={handleCategoryChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Price (Rs):</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={product.price}
                                onChange={handleInputChange}
                                placeholder="Enter price"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="image">Product Image:</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            {product.imageUrl && (
                                <div className="image-preview">
                                    <img
                                        src={product.imageUrl}
                                        alt="Product Preview"
                                        className="product-previews"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="update-btn">Save Changes</button>
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate('/list')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default UpdateProduct;
