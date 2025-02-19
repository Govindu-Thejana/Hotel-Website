import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:5555/gallery',  // Replace with your server URL
  });

// Fetch all gallery images
export const fetchAllImages = async () => {
  try {
    const response = await api.get('/');
    return response.data;  // Returns an array of images
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error; // You can handle it in your UI component
  }
};

// Fetch a single image by ID
export const fetchImageById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;  // Returns the image details
  } catch (error) {
    console.error('Error fetching image by ID:', error);
    throw error;
  }
};

// Add a new image
export const addImage = async (formData) => {
  try {
    const response = await api.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;  // Returns the newly added image
  } catch (error) {
    console.error('Error adding image:', error);
    throw error;
  }
};

// Update an image by ID
export const updateImage = async (id, formData) => {
  try {
    const response = await api.put(`/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;  // Returns the updated image details
  } catch (error) {
    console.error('Error updating image:', error);
    throw error;
  }
};

// Delete an image by ID
export const deleteImage = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;  // Success message
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

