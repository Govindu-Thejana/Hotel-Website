import React, { useState } from "react";
import "./Add.css";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUpload,
  FaUtensils,
  FaTag,
  FaMoneyBillWave,
  FaAlignLeft,
} from "react-icons/fa";

const Add = ({ url }) => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !productData.name ||
      !productData.price ||
      !productData.category ||
      !image
    ) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("product_image", image);

    try {
      const response = await axios.post(`${url}/api/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Product added successfully!");
        // Reset the form
        setProductData({
          name: "",
          description: "",
          price: "",
          category: "",
        });
        setImage(null);
        setImagePreview(null);
      } else {
        toast.error(response.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add">
      <div className="add-header">
        <h2>Add New Menu Item</h2>
        <p>
          Fill in the details below to add a new dish to your restaurant menu
        </p>
      </div>

      <form className="add-form" onSubmit={handleSubmit}>
        <div className="add-form-row">
          <div className="add-img-upload">
            <label>
              <FaUpload className="form-icon" /> Product Image
            </label>
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
                id="product-image"
              />
              <label htmlFor="product-image" className="upload-label">
                {imagePreview ? "Change Image" : "Choose Image"}
              </label>
              {imagePreview && (
                <div className="image-preview-wrapper">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="add-form-fields">
            <div className="add-product-name">
              <label>
                <FaUtensils className="form-icon" /> Product Name
              </label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="add-product-description">
              <label>
                <FaAlignLeft className="form-icon" /> Description
              </label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows="4"
              ></textarea>
            </div>

            <div className="add-category-price">
              <div className="add-category">
                <label>
                  <FaTag className="form-icon" /> Category
                </label>
                <select
                  name="category"
                  value={productData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Appetizers">Appetizers</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Specials">Specials</option>
                </select>
              </div>

              <div className="add-price">
                <label>
                  <FaMoneyBillWave className="form-icon" /> Price (Rs.)
                </label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="add-btn-container">
          <button type="submit" className="add-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
