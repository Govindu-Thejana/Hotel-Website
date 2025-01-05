import React, { useContext, useState } from 'react';
import { CartContext } from '../../contexts/CartContext';
import Cart from '../../components/roomBookings/Cart'; // Import the Cart component
import PayPalButton from "../../components/roomBookings/paypalPayment";


const CheckoutPage = () => {
    const { cart } = useContext(CartContext); // Get the cart from context
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the form submission logic (e.g., send data to server)
        console.log('User Details:', userDetails);
        console.log('Cart:', cart);
    };

    return (
        <div className="flex flex-col md:flex-row mx-auto max-w-7xl min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            {/* Cart section on the left */}
            <div className="w-full md:w-1/3 p-4 bg-gray-50">
                <Cart />
            </div>

            {/* User details form on the right */}
            <div className="w-full md:w-2/3 p-4">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={userDetails.firstName}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={userDetails.lastName}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={userDetails.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={userDetails.phone}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={userDetails.address}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={userDetails.city}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={userDetails.state}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="zip" className="block text-sm font-medium text-gray-700">Zip Code</label>
                            <input
                                type="text"
                                id="zip"
                                name="zip"
                                value={userDetails.zip}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Place Order
                        </button>
                        <PayPalButton /> //stripe payment(credit or ebit card butoon) is in this component also

                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;