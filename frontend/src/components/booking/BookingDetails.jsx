import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { getAllBookings } from './BookingCrudApi'; // Replace with your actual API path

const BookingDetails = () => {
    const [activeTab, setActiveTab] = useState('current');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await getAllBookings();
                setBookings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    const { currentBookings, pastBookings } = bookings.reduce(
        (acc, booking) => {
            const checkOutDate = new Date(booking.checkOut);
            const now = new Date();
            if (checkOutDate >= now) {
                acc.currentBookings.push(booking);
            } else {
                acc.pastBookings.push(booking);
            }
            return acc;
        },
        { currentBookings: [], pastBookings: [] }
    );

    const renderBookingCard = (booking) => (
        <div
            key={booking.bookingId}
            className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {booking.roomId?.roomType || 'Room Booking'}
                    </h3>
                    <p className="text-gray-600">{booking.fullName}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                    {booking.bookingConfirmationCode}
                </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <div>
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-medium">{formatDate(booking.checkIn)}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <div>
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="font-medium">{formatDate(booking.checkOut)}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center text-sm">
                <div className="text-gray-600">Guests: {booking.guests}</div>
                <div className="font-semibold text-green-600">${booking.totalAmount}</div>
            </div>
            {booking.specialRequests && (
                <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium">Special Requests:</p>
                    <p>{booking.specialRequests}</p>
                </div>
            )}
        </div>
    );

    if (loading) {
        return <div className="text-center py-8">Loading bookings...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Bookings</h2>
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setActiveTab('current')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'current'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Current Bookings ({currentBookings.length})
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'past'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Past Bookings ({pastBookings.length})
                </button>
            </div>
            <div className="space-y-4">
                {activeTab === 'current'
                    ? currentBookings.length > 0
                        ? currentBookings.map(renderBookingCard)
                        : <div className="text-center py-8 text-gray-600">No current bookings found</div>
                    : pastBookings.length > 0
                        ? pastBookings.map(renderBookingCard)
                        : <div className="text-center py-8 text-gray-600">No past bookings found</div>}
            </div>
        </div>
    );
};

export default BookingDetails;
