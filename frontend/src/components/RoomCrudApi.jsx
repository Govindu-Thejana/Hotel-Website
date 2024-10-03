import axios from "axios";

// Function to add a new room
export const addRooms = async (roomId, roomType, description, capacity, pricePerNight, availability, cancellationPolicy, amenities, images) => {
    const roomData = {
        roomId,
        roomType,
        description,
        capacity,
        pricePerNight,
        availability: availability === 'true', // Convert availability to boolean
        cancellationPolicy,
        amenities,  // Include amenities
        images      // Include images
    };

    try {
        const response = await axios.post('http://localhost:5555/rooms/', roomData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.status === 201;
    } catch (error) {
        console.error('Error adding room:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to add room');
    }
};