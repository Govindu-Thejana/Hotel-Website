import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:5555/bookedRoom',  // Replace with your server URL
});

export const getAllBookings = async () => {
    try {
        const response = await api.get('/bookings');
        return response.data; // Return the list of bookings
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error; // Propagate the error for handling in the frontend
    }
};

export const getBookingsFromTodayOnwards = async () => {
  try {
      const response = await api.get('/bookings/today-onwards');
      return response.data; // Returns { total: number, bookings: [...] }
  } catch (error) {
      console.error("Error fetching today's bookings:", error);
      throw error;
  }
};
