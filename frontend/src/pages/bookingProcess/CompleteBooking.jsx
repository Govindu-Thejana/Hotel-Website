import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { format } from 'date-fns';
import { FaCheckCircle } from 'react-icons/fa';

const BookingConfirmation = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Redirect to home page after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      clearCart();
      navigate('/');
    }, 300000); // 30 seconds

    return () => clearTimeout(timer);
  }, [navigate, clearCart]);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 py-12 flex flex-col items-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">No Booking Found</h1>
        <p className="text-gray-600 mb-6">It looks like you haven't made any bookings.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition-all"
        >
          Go to Home
        </button>
      </div>
    );
  }

  // Calculate total amount for all rooms
  const totalAmount = cart.reduce((sum, room) => sum + room.totalAmount, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 py-12 flex flex-col items-center">
      <FaCheckCircle className="text-green-500 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
      <p className="text-gray-600 mb-6 text-center">Thank you for your booking.</p>

      <div className="bg-white p-6 rounded-xl shadow-lg w-full mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Details</h2>

        {cart.map((booking, index) => (
          <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Room {index + 1}: {booking.room.roomType}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <p className="text-gray-500 text-sm">Check-in</p>
                <p className="font-medium text-sm">{format(new Date(booking.checkIn), 'EEE, MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Check-out</p>
                <p className="font-medium text-sm">{format(new Date(booking.checkOut), 'EEE, MMM d, yyyy')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <p className="text-gray-500 text-sm">Guests</p>
                <p className="font-medium text-sm">
                  {booking.guests.adults} Adults, {booking.guests.children} Children
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Room Price</p>
                <p className="font-medium text-sm">${booking.totalAmount.toFixed(2)}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Add-ons</p>
              <p className="font-medium text-sm">
                {booking.addons.length > 0
                  ? booking.addons.map((addon, idx) => (
                    <span key={idx}>
                      {addon.type} (${addon.price.toFixed(2)})
                      {idx < booking.addons.length - 1 ? ', ' : ''}
                    </span>
                  ))
                  : 'None'}
              </p>
            </div>
          </div>
        ))}

        <div className="mt-4">
          <p className="text-gray-500 text-sm font-bold">Total Amount</p>
          <p className="font-bold text-lg">${totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <p className="text-gray-600 mb-4">You will be redirected to the home page shortly.</p>
      <button
        onClick={() => navigate('/')}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition-all"
      >
        Go to Home
      </button>
    </div>
  );
};

export default BookingConfirmation;