import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { FaSearch, FaTimesCircle, FaHotel } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import SearchBar from '../../components/roomBookingSearchBar';
import { toast } from 'react-toastify';

const MyBookings = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const handleSearch = useCallback(async (e) => {
        e.preventDefault();

        if (!confirmationCode.trim()) {
            setError('Please enter a confirmation code');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');
        setBooking(null);

        try {
            const response = await axios.get(
                `https://hotel-website-backend-drab.vercel.app/bookedroom/bookings/confirmation/${confirmationCode}`,
                { timeout: 5000 }
            );
            if (response.data) {
                setBooking(response.data);
            } else {
                setError('No booking found with this confirmation code');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to find booking. Please check your code and try again.');
        } finally {
            setLoading(false);
        }
    }, [confirmationCode]);

    const isCancellationAllowed = useCallback(() => {
        if (!booking || !booking.checkIn) {
            return false;
        }

        const checkInDate = new Date(booking.checkIn);
        const now = new Date();
        const timeDifference = checkInDate.getTime() - now.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

        return daysDifference > 2;
    }, [booking]);

    const handleCancelBooking = useCallback(async () => {
        if (!booking?._id) {
            setError('No booking selected for cancellation');
            return;
        }

        if (!isCancellationAllowed()) {
            setError('Cancellation is only allowed 48 hours before check-in.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.put(`https://hotel-website-backend-drab.vercel.app/bookedroom/bookings/${booking._id}/cancel`);
            setSuccess('Booking cancelled successfully');
            setBooking({ ...booking, status: 'Cancelled' });
            setShowCancelModal(false);
            toast.success('Booking cancelled successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel booking');
            console.error('Error cancelling booking:', err);
            toast.error('Failed to cancel booking. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [booking, isCancellationAllowed]);

    const formatDate = useCallback((dateString) => {
        return dateString
            ? new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            : 'N/A';
    }, []);

    const clearInput = () => {
        setConfirmationCode('');
        setBooking(null);
        setError('');
        setSuccess('');
    };

    return (
        <div className="min-h-screen pb-12 bg-gray-50">
            {/* hero section */}
            <section className="relative">
                {/* Background image */}
                <img
                    src="/images/Building.jpg"
                    alt="Hotel Exterior"
                    className="w-full h-96 object-cover"
                />

                {/* Overlay with logo */}
                <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                    <div className="text-center flex flex-col items-center justify-center">
                        <img
                            alt="Suneragira Hotel"
                            src="/images/logo.png"
                            className="h-24 md:h-40 lg:h-48 w-auto px-5" // Responsive logo size
                        />
                    </div>
                </div>

                {/* Search Bar at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-opacity-80 px-10">
                    <SearchBar />
                </div>
            </section>

            <div className="max-w-4xl mx-auto relative">
                <h1 className="text-3xl font-bold text-gray-800 py-6 mb-8 text-center">MY BOOKINGS</h1>
                {/* Search Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                            <FaSearch className="mr-2 text-scolor" />
                            VIEW OR CANCEL YOUR RESERVATION HERE
                        </h2>
                        {confirmationCode && (
                            <button
                                onClick={clearInput}
                                className="text-gray-500 hover:text-gray-700"
                                aria-label="Clear search"
                            >
                                <FaTimesCircle size={20} />
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <label htmlFor="confirmationCode" className="block text-sm font-medium text-gray-700">
                                Confirmation Code
                            </label>
                            <div className="flex mt-1">
                                <input
                                    type="text"
                                    id="confirmationCode"
                                    value={confirmationCode}
                                    onChange={(e) => setConfirmationCode(e.target.value)}
                                    placeholder="Enter confirmation code"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-scolor focus:border-scolor disabled:bg-gray-100"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-scolor text-white rounded-r-md hover:bg-pcolor disabled:bg-scolor flex items-center justify-center min-w-[60px]"
                                >
                                    {loading ? (
                                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                    ) : (
                                        <FaSearch />
                                    )}
                                </button>
                            </div>
                        </div>
                        {(error || success) && (
                            <div className={`p-3 rounded-md ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                {error || success}
                            </div>
                        )}
                    </form>
                </div>

                {/* Booking Details */}
                {booking && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Booking Details</h3>
                            <span className={`px-3 py-1 rounded-full text-sm ${booking.status === 'Confirmed'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'Cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'}`}>
                                {booking.status}
                            </span>
                        </div>

                        <div className={isMobile ? 'space-y-3' : 'grid grid-cols-2 gap-6'}>
                            <div>
                                <p><strong>Confirmation Code:</strong> {booking.confirmationCode}</p>
                                <p><strong>Name:</strong> {booking.guestName || 'N/A'}</p>
                                <p><strong>Email:</strong> {booking.email || 'N/A'}</p>
                                <p><strong>Phone:</strong> {booking.phone || 'N/A'}</p>
                                <p><strong>Guests:</strong> {booking.guests.adults || 0} Adults, {booking.guests.children || 0} Children</p>
                                <p><strong>CancellationPolicy:</strong> {booking.cancellationPolicy || 'N/A'}</p>
                            </div>
                            <div>
                                <p><strong>Check-in:</strong> {formatDate(booking.checkIn)}</p>
                                <p><strong>Check-out:</strong> {formatDate(booking.checkOut)}</p>
                                <p><strong>Addons:</strong> {booking.addons?.length > 0 ? booking.addons.map(a => a.type).join(', ') : 'N/A'}</p>
                                <p><strong>Total:</strong> ${booking.totalPrice?.toFixed(2) || '0.00'}</p>
                                <p><strong>Room Type:</strong> {booking.roomType || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Always show Cancel button when there's a booking */}
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => setShowCancelModal(true)}
                                disabled={loading || !isCancellationAllowed()}
                                className={`px-6 py-2 ${isCancellationAllowed() ? 'bg-scolor hover:bg-pcolor' : 'bg-gray-400 cursor-not-allowed'} text-white rounded-md  flex items-center gap-2`}
                            >
                                <FaTimesCircle /> Cancel Booking
                            </button>
                        </div>
                    </div>
                )}

                {/* Cancel Confirmation Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                aria-label="Close"
                            >
                                <FaTimesCircle size={24} />
                            </button>
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-lg font-semibold">Confirm Cancellation</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to cancel booking "{booking?.confirmationCode}"?
                                This action cannot be undone.
                            </p>
                            {!isCancellationAllowed() && (
                                <p className="text-yellow-600 mb-4">
                                    Note: Cancellation is only allowed 48 hours before check-in.
                                </p>
                            )}
                            {booking?.status === 'Cancelled' && (
                                <p className="text-yellow-600 mb-4">
                                    Note: This booking is already cancelled.
                                </p>
                            )}
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    disabled={loading}
                                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
                                >
                                    No, Keep Booking
                                </button>
                                <button
                                    onClick={handleCancelBooking}
                                    disabled={loading || booking?.status === 'Cancelled' || !isCancellationAllowed()}
                                    className={`px-4 py-2 ${isCancellationAllowed() ? 'bg-scolor hover:bg-pcolor' : 'bg-gray-400 cursor-not-allowed'} text-white rounded-md  flex items-center gap-2`}
                                >
                                    {loading && (
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                    )}
                                    Yes, Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;