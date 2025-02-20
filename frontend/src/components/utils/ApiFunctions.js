import axios from "axios";

export const api = axios.create({
    baseURL: "https://hotel-website-backend-drab.vercel.app"
});

const getHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found in localStorage");
    }
    return {
        Authorization: `Bearer ${token || ''}`,
        'Content-Type': 'application/json'
    };
};


// Update a specific room by ID
export async function updateRoom(_id, roomData) {
    try {
        // Send PUT request with JSON data directly
        const response = await api.put(`/rooms/${_id}`, roomData, {
            headers: getHeader()
        });
        return response;
    } catch (error) {
        console.error("Error updating room:", error);
        throw new Error(error.response?.data?.message || 'Error updating room');
    }
}
// retrieve room by _id
export async function getRoomById(_id) {
    try {
        const result = await api.get(`/rooms/${_id}`);
        return result.data;
    } catch (error) {
        throw new Error(`Error fetching room: ${error.message}`);
    }
}

/////////////////////////////////////////////////////////////

// Create a new booking

// Create a new booking
export async function createBooking(bookingData) {
    try {
        console.log(bookingData);
        const response = await api.post('/bookedRoom/bookings', bookingData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Booking creation failed:', error);

        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else if (error.response?.status === 500) {
            throw new Error('Server error. Please try again later.');
        } else {
            throw new Error(`Failed to create booking. Please try again : ${error.message}`);
        }
    }
}



// Get booking details by ID
export async function getBookingById(bookingId) {
    try {
        const response = await api.get(`/bookings/${bookingId}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching booking');
    }
}

// Cancel a booking
export async function cancelBooking(bookingId) {
    try {
        const response = await api.delete(`/bookings/${bookingId}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error cancelling booking');
    }
}

// Check room availability
export async function checkRoomAvailability(roomId, checkIn, checkOut) {
    try {
        const response = await api.get('/rooms/availability', {
            params: { roomId, checkIn, checkOut },
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error checking room availability');
    }
}

