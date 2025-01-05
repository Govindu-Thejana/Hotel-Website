import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { format, differenceInDays } from 'date-fns';
import { ClipLoader } from 'react-spinners'; // Import the ClipLoader
import {
  FaTrash,
  FaInfoCircle,
  FaMoon,
  FaUsers,
  FaCalendarAlt,
  FaCreditCard,
  FaSpinner
} from 'react-icons/fa';

const Cart = () => {
  const { cart, removeFromCart, clearCart, removeAddonFromRoom, loading } = useContext(CartContext);
  const [showAlert, setShowAlert] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false); // Checkout loading state
  const navigate = useNavigate();

  // Navigate to /reservation if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !loading) {
      navigate('/reservation');
    }
  }, [cart, loading, navigate]);

  // Calculate number of nights between two dates
  const calculateNights = (checkIn, checkOut) => {
    return differenceInDays(new Date(checkOut), new Date(checkIn));
  };

  const calculateTotals = (item) => {
    const nights = calculateNights(item.checkIn, item.checkOut);
    const perNightRate = item.totalAmount / nights;
    const addonsTotal = item.addons.reduce((total, addon) => total + addon.price, 0);

    return {
      basePrice: item.totalAmount,
      addonsTotal: addonsTotal,
      vat: (item.totalAmount + addonsTotal) * 0.1,
      serviceFee: 3.00,
      total: item.totalAmount + addonsTotal + (item.totalAmount + addonsTotal) * 0.1 + 3.00,
      perNight: perNightRate,
      numberOfNights: nights
    };
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleRemoveAddon = (roomId, addonType) => {
    removeAddonFromRoom(roomId, addonType); // Remove the addon from the room
  };

  // Handle the checkout process
  const handleCheckout = () => {
    setCheckoutLoading(true); // Set loading to true
    setTimeout(() => {
      setCheckoutLoading(false); // Set loading to false after a delay
      navigate('/checkout'); // Navigate to the checkout page
    }, 1000); // Simulate loading time
  };

  const calculateOverallTotal = () => {
    return cart.reduce((total, item) => {
      const itemTotal = calculateTotals(item).total;
      return total + itemTotal;
    }, 0).toFixed(2);
  };

  const NightsBadge = ({ nights }) => (
    <div className="flex items-center space-x-1 text-scolor px-2 py-1 rounded-full">
      <FaMoon className="text-sm" />
      <span className="font-medium text-xs">{nights} {nights === 1 ? 'night' : 'nights'}</span>
    </div>
  );

  const StayDuration = ({ checkIn, checkOut, nights }) => (
    <div className="bg-gray-50 p-2 rounded-xl mb-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="text-scolor" />
          <div>
            <p className="text-xs text-gray-500">CHECK IN</p>
            <p className="font-medium text-xs">{format(new Date(checkIn), 'EEE, MMM d, yyyy')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="text-scolor" />
          <div>
            <p className="text-xs text-gray-500">CHECK OUT</p>
            <p className="font-medium text-xs">{format(new Date(checkOut), 'EEE, MMM d, yyyy')}</p>
          </div>
        </div>
      </div>
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-600">
          Total stay: <span className="font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</span>
        </p>
      </div>
    </div>
  );

  const CartItem = ({ item }) => {
    const totals = calculateTotals(item);

    return (
      <div className="bg-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Room Header */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{item.roomType}</h3>
            <span className="text-xs text-gray-500">Room {item.roomId}</span>
          </div>
          <NightsBadge nights={totals.numberOfNights} />
        </div>

        {/* Stay Duration Component */}
        <StayDuration
          checkIn={item.checkIn}
          checkOut={item.checkOut}
          nights={totals.numberOfNights}
        />

        {/* Guest Information */}
        <div className="flex items-center space-x-2 mb-2">
          <FaUsers className="text-scolor" />
          <div>
            <p className="text-xs text-gray-500">GUESTS</p>
            <p className="font-medium text-xs">
              {item.guests.adults} {item.guests.adults === 1 ? 'Adult' : 'Adults'}
              {item.guests.children > 0 && `, ${item.guests.children} ${item.guests.children === 1 ? 'Child' : 'Children'}`}
            </p>
          </div>
        </div>

        {/* Add-ons */}
        {item.addons.length > 0 && (
          <div className="bg-gray-50 p-2 rounded-xl space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">Add-ons</h4>
            {item.addons.map((addon, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span>{addon.type}</span>
                <div className="flex items-center">
                  <span className="mr-2">${addon.price.toFixed(2)}</span>
                  <button
                    onClick={() => handleRemoveAddon(item.room._id, addon.type)}
                    className=" hover:bg- text-pcolor text-xs px-2 py-1 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Price Breakdown */}
        <div className="bg-gray-50 p-2 rounded-xl space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-1">
              <FaMoon className="text-scolor" />
              <span className="text-xs">Room Rate</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-xs">${totals.basePrice.toFixed(2)}</p>
              <p className="text-xs text-gray-500">
                ${totals.perNight.toFixed(2)} × {totals.numberOfNights} nights
              </p>
            </div>
          </div>

          {item.addons.length > 0 && (
            <div className="flex justify-between text-xs">
              <span>Add-ons</span>
              <span>${totals.addonsTotal.toFixed(2)}</span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span>VAT (10%)</span>
              <span>${totals.vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Service Fee</span>
              <span>${totals.serviceFee.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between font-bold text-sm">
              <span>Total</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleRemove(item.room._id)}
            className=" hover:text-pcolor text-scolor py-1 px-2 rounded-md transition-colors flex items-center space-x-1 text-xs"
          >
            <FaTrash className="text-xs" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {showAlert && (
        <p className="flex items-center">
          <FaInfoCircle className="mr-2" />
          Item removed from cart successfully
        </p>
      )}

      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
        <p className="text-xl text-gray-500 mt-1">
          {cart.length} {cart.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader className="animate-spin text-4xl text-scolor" />
        </div>
      ) : cart.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-2xl">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 mb-4">
            {cart.map((item) => (
              <CartItem key={item.room._id} item={item} />
            ))}
          </div>

          {/* Display overall total */}
          <div className="bg-white p-4 rounded-2xl shadow-lg mb-4">
            <div className="flex justify-between items-center font-bold text-sm">
              <span>Overall Total</span>
              <span>${calculateOverallTotal()}</span>
            </div>
          </div>

          <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-lg">
            <div>
              <button
                onClick={() => navigate('/reservation')}
                className="text-pcolor hover:text-scolor flex items-center space-x-1 text-xs"
              >
                <span>Add Room</span>
              </button>
            </div>
            <button
              onClick={handleCheckout} // Use handleCheckout for the checkout button
              className="bg-scolor hover:bg-pcolor text-white px-6 py-2 rounded-xl transition-all flex items-center space-x-1 text-sm"
              disabled={checkoutLoading} // Disable button while loading
            >
              {checkoutLoading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  <FaCreditCard />
                  <span>Checkout</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;