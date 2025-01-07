import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ShoppingCart = () => {
  // Cart items
  const items = [
    { name: "Double Room", price: 50, quantity: 1 },
    { name: "Dinner & Breakfast", price: 20, quantity: 2 }
  ];

  // Calculate total
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Initialize useNavigate
  const navigate = useNavigate();

  // Handle checkout
  const handleCheckout = () => {
    navigate("/checkout"); // Navigate to the checkout route
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Shopping Cart</h1>

      {/* Cart Items List */}
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="border-b border-gray-300 pb-4">
            <h3 className="text-xl font-medium">{item.name}</h3>
            <p className="text-gray-700">Price: ${item.price.toFixed(2)}</p>
            <p className="text-gray-700">Quantity: {item.quantity}</p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-6 flex justify-between items-center border-t border-gray-300 pt-4">
        <h2 className="text-2xl font-semibold">Total:</h2>
        <p className="text-xl font-semibold text-green-600">${total.toFixed(2)}</p>
      </div>

      {/* Checkout Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleCheckout} // Trigger navigate on click
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart;
