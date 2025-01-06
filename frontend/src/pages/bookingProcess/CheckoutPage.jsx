import React, { useContext, useState } from 'react';
import { createBooking } from '../../components/utils/ApiFunctions';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import Cart from '../../components/roomBookings/Cart';
import { ClipLoader } from 'react-spinners';
import CheckoutButton from '../../components/roomBookings/checkOutButton';

const CheckoutPage = () => {
    const { cart, removeItemFromCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        prefix: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        country: '',
        address1: '',
        city: '',
        zipCode: '',
        paymentMethod: 'payLater' // default payment method
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const bookingData = {
            ...formData,
            cart
        };

        // Validate booking data
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address1 || !formData.city || !formData.zipCode || cart.length === 0) {
            alert("Please fill in all required fields and add at least one room to the cart.");
            setLoading(false);
            return;
        }

        try {
            const response = await createBooking(bookingData);
            console.log("Booking created successfully:", response);
            alert('Booking created successfully!');
            navigate('/CompleteBooking', { state: { booking: response.data } });
        } catch (error) {
            console.error("Error creating booking:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 py-12 flex flex-col lg:flex-row lg:space-x-12">
            {/* Form Section */}
            <div className="w-full lg:w-2/3">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <h2 className="text-2xl font-bold mb-4">Guest Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Form fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Prefix</label>
                            <select name="prefix" value={formData.prefix} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="">Select</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Ms.">Ms.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Dr.">Dr.</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Country</label>
                            <input type="text" name="country" value={formData.country} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input type="text" name="address1" value={formData.address1} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                            <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold my-4">Payment Options</h2>
                    <p className="text-gray-600 mb-4">Choose how you would like to pay. You can pay now using PayPal, Credit Card, or Debit Card. Or, you can choose to pay after you arrive.</p>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input id="payLater" name="paymentMethod" type="radio" value="payLater" checked={formData.paymentMethod === 'payLater'} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                            <label htmlFor="payLater" className="ml-3 block text-sm font-medium text-gray-700">Pay After You Arrive</label>
                        </div>
                        <div className="flex items-center">
                            <input id="paypal" name="paymentMethod" type="radio" value="paypal" checked={formData.paymentMethod === 'paypal'} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                            <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">PayPal</label>
                        </div>
                        <div className="flex items-center">
                            <input id="creditCard" name="paymentMethod" type="radio" value="creditCard" checked={formData.paymentMethod === 'creditCard'} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                            <label htmlFor="creditCard" className="ml-3 block text-sm font-medium text-gray-700">Credit Card</label>
                        </div>
                        <div className="flex items-center">
                            <input id="debitCard" name="paymentMethod" type="radio" value="debitCard" checked={formData.paymentMethod === 'debitCard'} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                            <label htmlFor="debitCard" className="ml-3 block text-sm font-medium text-gray-700">Debit Card</label>
                        </div>
                    </div>
                    <div>
                        <CheckoutButton />
                    </div>

                    <button type="submit" className="mt-6 w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {loading ? <ClipLoader size={24} color={"#ffffff"} /> : 'Confirm Booking'}
                    </button>
                </form>
            </div>

            {/* Cart Section */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
                <Cart cartItems={cart} onRemoveItem={removeItemFromCart} />
            </div>

            {/* Policies Section */}
            <div className="w-full lg:w-2/3 mt-8 lg:mt-0">
                <h2 className="text-2xl font-bold my-4">Policies</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-semibold">Check-in</h3>
                        <p className="text-gray-600">After 2:00 pm</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Room 1 Standard King Room Without Outside View</h3>
                        <p className="text-gray-600">Guarantee Policy: Credit card is required for guarantee.</p>
                        <p className="text-gray-600">Cancel Policy: Free cancellation up to one day before arrival. Full stay charged in case of late cancellation or no-show.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Check-out</h3>
                        <p className="text-gray-600">Before 12:00 pm</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;