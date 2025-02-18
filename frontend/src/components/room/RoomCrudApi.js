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

export const getRoomDetails = async (roomId) => {
    try {
        // Make a GET request to the backend
        const response = await api.get(`/rooms/${roomId}`);
        const room = response.data;

        // Convert image paths to fully qualified URLs
        if (Array.isArray(room.images)) {
            room.images = room.images.map((image) => `${api.defaults.baseURL}/${image}`);
        }

        // Handle amenities parsing
        if (Array.isArray(room.amenities)) {
            room.amenities = room.amenities.flatMap((amenity) => {
                try {
                    // Parse each stringified array into an array of strings
                    return JSON.parse(amenity).map((item) => item.toString().trim());
                } catch (err) {
                    console.warn('Failed to parse amenity:', amenity, err.message);
                    return []; // Return an empty array if parsing fails
                }
            });
        } else {
            // Default to an empty array if amenities are not in the expected format
            room.amenities = [];
        }

        return room; // Return the normalized room data
    } catch (error) {
        console.error('Error fetching room details:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch room details');
    }
};

// Update a specific room by ID
export async function updateRoom(_id, roomData) {
    try {
        const formData = new FormData();

        // Append room details to FormData
        Object.entries(roomData).forEach(([key, value]) => {
            if (key === "images") {
                value.forEach((image) => {
                    if (image instanceof File) {
                        formData.append("images", image); // Append new images
                    }
                });
            } else if (key === "existingImages") {
                formData.append("existingImages", JSON.stringify(value)); // Append existing directories
            } else if (key === "amenities") {
                formData.append("amenities", JSON.stringify(value)); // Serialize amenities
            } else {
                formData.append(key, value); // Append other fields
            }
        });

        // Make the API call
        const response = await axios.put(`http://localhost:5555/rooms/${_id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error in updateRoom:", error.response?.data || error.message);
        throw error;
    }
}


export const deleteRoom = async (id) => {
    try {
        const response = await api.delete(`/rooms/${id}`);
        return response.data; // Return the response from the server
    } catch (error) {
        console.error("Error deleting room:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to delete room");
    }
};



