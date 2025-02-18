import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookedDatesByRoomType = () => {
    const [roomType, setRoomType] = useState('');  // State for selected room type
    const [bookedDates, setBookedDates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [roomTypes] = useState(['Deluxe Suite', 'Executive Suite', 'Single', 'Double']);  // Example room types

    // Function to fetch booked dates based on room type
    const fetchBookedDates = async (selectedRoomType) => {
        if (!selectedRoomType) return;  // If no room type is selected, do nothing

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5555/api/bookedRoom/bookings/room/${selectedRoomType}`);
            setBookedDates(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching booked dates');
            setLoading(false);
        }
    };

    // Trigger the fetch when roomType changes
    useEffect(() => {
        if (roomType) {
            fetchBookedDates(roomType);
        }
    }, [roomType]);

    return (
        <div className="room-booking-container">
            <h2>Check Booked Dates for a Room</h2>

            {/* Room Type Dropdown */}
            <div>
                <label htmlFor="room-type">Select Room Type:</label>
                <select
                    id="room-type"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="dropdown"
                >
                    <option value="">Select Room Type</option>
                    {roomTypes.map((type, index) => (
                        <option key={index} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            {/* Loading, Error, or Booked Dates Display */}
            {loading && <p>Loading booked dates...</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Show booked dates if available */}
            {!loading && !error && bookedDates.length > 0 && (
                <div>
                    <h3>Booked Dates for {roomType}:</h3>
                    <ul>
                        {bookedDates.map((date, index) => (
                            <li key={index}>{new Date(date).toLocaleDateString()}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Show message if no bookings are available */}
            {!loading && !error && bookedDates.length === 0 && roomType && (
                <p>No bookings found for {roomType}.</p>
            )}
        </div>
    );
};

export default BookedDatesByRoomType;