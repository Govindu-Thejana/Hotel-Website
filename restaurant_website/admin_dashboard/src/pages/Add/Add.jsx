import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Add = ({ url }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null); // Use 'file' instead of 'image'
  const [data, setData] = useState({
    name: '',
    description: '',
    category: 'Salad',
    price: ''
  });
  const [errors, setErrors] = useState({});

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
    setErrors((errors) => ({ ...errors, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!data.name) newErrors.name = 'Product name is required';
    if (!data.description) newErrors.description = 'Product description is required';
    if (!data.price || isNaN(Number(data.price))) newErrors.price = 'Invalid price';
    if (!file) newErrors.file = 'Product image is required'; // Use 'file' here

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      toast.info("Uploading image to Cloudinary...");
      const formData = new FormData();
      formData.append("file", file); // Use 'file' instead of 'image'
      formData.append("upload_preset", "Restaurant"); // Your upload preset
      formData.append("cloud_name", "dgdkvmijt"); // Your Cloudinary cloud name

      // Upload image to Cloudinary
      const res = await fetch("https://api.cloudinary.com/v1_1/dgdkvmijt/image/upload", {
        method: "POST",
        body: formData, // Send the formData, not data
      });

      if (!res.ok) {
        const errorResponse = await res.json(); // Capture the response body
        toast.error("Error uploading image to Cloudinary:", errorResponse.error.message);
        throw new Error(`Error uploading image: ${errorResponse.error.message}`);
      }
      if (res.ok) {
        toast.success("Image uploaded successfully");
      }
      const uploadedImageURL = await res.json();
      console.log('Uploaded Image URL:', uploadedImageURL.secure_url); // URL of the uploaded image

      // Now you can send the product data along with the image URL
      const productData = {
        ...data,
        price: Number(data.price),
        image: uploadedImageURL.secure_url, // Add the uploaded image URL here
      };

      // Make a POST request to your server to save the product data
      try {
        toast.info("Adding product to the database...");
        const response = await axios.post(`${url}/api/products/add`, productData);
        console.log('Server Response:', response.data); // Log the server response
        if (response.data.success) {
          setData({
            name: '',
            description: '',
            category: 'Salad',
            price: ''
          });
          setFile(null);
          toast.success(response.data.message);
          navigate('/list'); // Navigate back to the list page

        } else {
          toast.error(response.data.message || "Failed to add product");
        }
      } catch (error) {
        console.error("Error adding product:", error);
        toast.error("Failed to add product. Please check your connection.");
      }
    } catch (uploadError) {
      console.error('Error uploading image:', uploadError);
      toast.error(`Failed to upload image. Details: ${uploadError.message}`);
    }
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          {errors.file && <p style={{ color: 'red' }}>{errors.file}</p>}
          <label htmlFor="file">
            <img src={file ? URL.createObjectURL(file) : assets.upload_area} alt="" />
          </label>
          <input type="file" id="file" hidden required onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
          <input onChange={onChangeHandler} value={data.name} name="name" type="text" placeholder='Enter product name' />
        </div>

        <div className="add-product-description flex-col">
          <p>Product description</p>
          {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Enter product description'></textarea>
        </div>

        <div className="add-category-price">
          <p>Product category</p>
          <select name="category" id="category" onChange={onChangeHandler} value={data.category}>
            <option value="Salad">Salad</option>
            <option value="Rolls">Rolls</option>
            <option value="Deserts">Deserts</option>
            <option value="Sandwich">Sandwich</option>
            <option value="Cake">Cake</option>
            <option value="Pure Veg">Pure Veg</option>
            <option value="Pasta">Pasta</option>
            <option value="Noodles">Noodles</option>
          </select>
        </div>

        <div className="add-price flex-col">
          <p>Product price</p>
          {errors.price && <p style={{ color: 'red' }}>{errors.price}</p>}
          <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='Rs:20' />
        </div>

        <button type="submit" className='add-btn'>Add</button>
      </form>
    </div>
  );
};

export default Add;