import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5555", // Replace with your server URL
});

// Function to add a new room with file upload
export const addRooms = async (roomId, roomType, description, capacity, pricePerNight, availability, cancellationPolicy, amenities, images) => {
    const formData = new FormData();

    // Append room details to FormData
    formData.append("roomId", roomId);
    formData.append("roomType", roomType);
    formData.append("description", description);
    formData.append("capacity", capacity);
    formData.append("pricePerNight", pricePerNight);
    formData.append("availability", availability === 'true'); // Convert availability to boolean
    formData.append("cancellationPolicy", cancellationPolicy);

    // Append amenities as a JSON string
    formData.append("amenities", JSON.stringify(amenities));

    // Append image files
    images.forEach((image) => {
        formData.append("images", image); // `images` should be an array of File objects
    });

    try {
        const response = await api.post('/rooms/withfileupload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Ensure proper handling of file uploads
            },
        });

        return response.data; // Return the response from the server
    } catch (error) {
        console.error('Error adding room:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to add room');
    }
};
