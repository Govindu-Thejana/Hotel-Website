import axios from 'axios';

// Create an axios instance
const api = axios.create({
    baseURL: 'http://localhost:5555/bookedRoom', // Replace with your backend's base URL
});

// Function to create a new booking
export const createBooking = async (bookingData) => {
    try {
        const response = await api.post('/bookings', bookingData);
        return response.data; // Return the response from the server
    } catch (error) {
        console.error('Error creating booking:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
};

// Function to retrieve a booking by bookingId
export const getBooking = async (bookingId) => {
    try {
        const response = await api.get(`/bookings/${bookingId}`);
        return response.data; // Return the booking details
    } catch (error) {
        console.error('Error fetching booking:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch booking');
    }
};

// Function to cancel a booking
export const cancelBooking = async (bookingId) => {
    try {
        const response = await api.delete(`/bookings/${bookingId}`);
        return response.data; // Return the response from the server
    } catch (error) {
        console.error('Error cancelling booking:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to cancel booking');
    }
};

// Function to check room availability
export const checkRoomAvailability = async (roomId, checkIn, checkOut) => {
    try {
        const response = await api.get('/rooms/availability', {
            params: { roomId, checkIn, checkOut },
        });
        return response.data; // Return availability status
    } catch (error) {
        console.error('Error checking room availability:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to check room availability');
    }
};

// Function to retrieve all bookings
export const getAllBookings = async () => {
    try {
        const response = await api.get('/bookings');
        return response.data; // Return all bookings
    } catch (error) {
        console.error('Error fetching all bookings:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
};
