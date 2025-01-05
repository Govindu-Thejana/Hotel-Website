import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Create the CartContext
export const CartContext = createContext();

// Define add-on prices for different room types
const addonPrices = {
    "Deluxe Suite": { breakfast: 7.99, dinner: 9.99, bonfire: 4.99, bbq: 3.99 },
    "Executive Suite": { breakfast: 8.99, dinner: 9.99, bonfire: 4.99, bbq: 3.99 },
    "Single Room": { breakfast: 1.99, dinner: 2.99, bonfire: 4.99, bbq: 3.99 },
    "Double Room": { breakfast: 3.99, dinner: 4.99, bonfire: 4.99, bbq: 3.99 },
    "BBQ Experience with Dinner": { price: 3.99 },
    "Cozy Bonfire": { price: 4.99 }
};

// CartProvider component
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [bookingDetails, setBookingDetails] = useState(null);

    // Load cart from localStorage when the component mounts
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const savedBookingDetails = localStorage.getItem('bookingDetails');
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedBookingDetails) setBookingDetails(JSON.parse(savedBookingDetails));
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Save bookingDetails to localStorage whenever it changes
    useEffect(() => {
        if (bookingDetails) {
            localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
        }
    }, [bookingDetails]);

    // Add a room to the cart
    const addToCart = (room) => {
        setCart([{ ...room, addons: [] }, ...cart]); // Prepend the new room to the cart
    };

    // Remove a room from the cart
    const removeFromCart = (roomId) => {
        setCart(cart.filter(item => item.room._id !== roomId));
    };

    // Clear the cart and booking details
    const clearCart = () => {
        setCart([]);
        setBookingDetails(null);
        localStorage.removeItem('bookingDetails');
        localStorage.removeItem('cart');
    };

    // Update booking details
    const updateBookingDetails = (details) => {
        setBookingDetails(details);
    };

    // Add an add-on to a specific room in the cart
    const addAddonToRoom = (roomId, addonType, adults, children) => {
        const room = cart.find(item => item.room._id === roomId);
        if (!room) return;

        const roomType = room.roomType;
        if (!addonPrices[roomType] || !addonPrices[roomType][addonType]) {
            console.error(`Add-on type ${addonType} not found for room type ${roomType}`);
            return; // Return if the roomType or addonType is not found
        }

        const addonPrice = addonPrices[roomType][addonType];
        const totalAddonPrice = addonPrice * adults + (addonPrice / 2) * children;

        const newAddon = {
            type: addonType,
            price: totalAddonPrice,
        };

        setCart(cart.map(item =>
            item.room._id === roomId ? { ...item, addons: [...item.addons, newAddon] } : item
        ));
    };

    // Remove an add-on from a specific room in the cart
    const removeAddonFromRoom = (roomId, addonType) => {
        setCart(cart.map(item =>
            item.room._id === roomId ? { ...item, addons: item.addons.filter(addon => addon.type !== addonType) } : item
        ));
    };

    // Provide cart and booking details management functions to children components
    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                bookingDetails,
                updateBookingDetails,
                addAddonToRoom,
                removeAddonFromRoom,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// PropTypes for the CartProvider component
CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default CartProvider;