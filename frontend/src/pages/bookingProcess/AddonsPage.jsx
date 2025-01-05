import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { ArrowLeft } from 'lucide-react';
import Cart from '../../components/roomBookings/Cart';
import { ClipLoader } from 'react-spinners'; // Import the ClipLoader

const TransportOptions = () => {
  const { cart, addAddonToRoom } = useContext(CartContext);
  const navigate = useNavigate();
  const [selectedRoomId, setSelectedRoomId] = useState(cart.length > 0 ? cart[0].room._id : null);
  const [loading, setLoading] = useState(false); // Loading state for spinner

  const addonNames = {
    breakfast: "Breakfast Buffet",
    dinner: "Dinner Service",
    bonfire: "Cozy Bonfire",
    bbq: "BBQ Experience with Dinner"
  };

  const getAddonPrice = (roomType, addonType) => {
    const addonPrices = {
      "Deluxe Suite": { breakfast: 7.99, dinner: 9.99, bonfire: 4.99, bbq: 3.99 },
      "Deluxe": { breakfast: 7.99, dinner: 9.99, bonfire: 4.99, bbq: 3.99 },
      "Executive Suite": { breakfast: 8.99, dinner: 9.99, bonfire: 4.99, bbq: 3.99 },
      "Suit": { breakfast: 8.99, dinner: 9.99, bonfire: 4.99, bbq: 3.99 },
      "Single": { breakfast: 1.99, dinner: 2.99, bonfire: 4.99, bbq: 3.99 },
      "Double": { breakfast: 3.99, dinner: 4.99, bonfire: 4.99, bbq: 3.99 },
      "BBQ Experience with Dinner": { price: 3.99 },
      "Cozy Bonfire": { price: 4.99 }
    };
    if (!addonPrices[roomType]) {
      console.error(`Room type ${roomType} not found in addonPrices`);
      return 0; // Return 0 if the roomType is not found
    }
    return addonPrices[roomType][addonType] || 0; // Return 0 if the addonType is not found
  };

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/reservation');
    }
  }, [cart, navigate]);

  if (cart.length === 0) {
    return <div className="flex justify-center items-center min-h-screen">No rooms added to the cart.</div>;
  }

  const selectedRoom = cart.find(room => room.room._id === selectedRoomId);
  const roomType = selectedRoom?.roomType;

  const handleCheckout = () => {
    setLoading(true); // Start loading
    setTimeout(() => { // Simulate a delay
      setLoading(false); // Stop loading
      navigate('/checkout'); // Navigate to checkout page
    }, 1000); // Adjust the delay as needed
  };

  return (
    <div className="flex flex-col md:flex-row mx-auto max-w-7xl min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      {/* Enhancements section */}
      <div className="flex flex-col w-full md:w-2/3 p-4 min-h-screen">
        <div className="flex items-center gap-2 text-blue-500 mb-8" onClick={() => navigate('/reservation')}>
          <ArrowLeft className="w-6 h-6" />
          <h1 className="text-2xl font-bold">ENHANCE YOUR STAY</h1>
        </div>

        <div className="space-y-4 mb-8">
          {Object.keys(addonNames).map((addonType, index) => (
            <div key={index} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{addonNames[addonType]}</h3>
                <div className="text-right">
                  <span className="text-2xl font-bold">${getAddonPrice(roomType, addonType)}</span>
                  <div className="text-sm text-gray-600">Per Person</div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">
                Add this enhancement to your stay.
              </p>

              <button
                onClick={() => addAddonToRoom(selectedRoomId, addonType, selectedRoom.guests.adults, selectedRoom.guests.children)}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto float-right hover:bg-blue-600 transition-colors"
              >
                ADD TO MY STAY
              </button>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          *This cost applies only to the first day of your booking and does not include for other dates.
        </p>

        {/* Checkout button */}
        <button
          onClick={handleCheckout}
          className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto mt-4 hover:bg-green-600 transition-colors"
        >
          {loading ? <ClipLoader size={20} color={"#ffffff"} /> : "Proceed to Checkout"}
        </button>
      </div>

      {/* Cart section */}
      <div className="w-full md:w-1/3 p-4 bg-gray-50">
        <Cart />
      </div>
    </div>
  );
};

export default TransportOptions;