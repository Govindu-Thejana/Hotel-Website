import React, { useContext, useState, useEffect } from 'react';
import { createBooking } from '../../components/utils/ApiFunctions';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import Cart from '../../components/roomBookings/Cart';
import { ClipLoader } from 'react-spinners';
import PayPalButton from '../../components/roomBookings/paypalPayment';

const CheckoutPage = () => {
    const { cart, removeItemFromCart } = useContext(CartContext); // Removed clearCart
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paypalError, setPaypalError] = useState(null);
    const [totalAmount, setTotalAmount] = useState(10);
    const [errors, setErrors] = useState({});

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
    });

    useEffect(() => {
        const newTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalAmount(newTotal);
    }, [cart]);

    const validateForm = () => {
        const newErrors = {};

        // Required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address1', 'city', 'zipCode'];
        requiredFields.forEach(field => {
            if (!formData[field]?.trim()) {
                newErrors[field] = 'This field is required';
            }
        });

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        // Zip code validation
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (formData.zipCode && !zipRegex.test(formData.zipCode)) {
            newErrors.zipCode = 'Please enter a valid ZIP code';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const sanitizeInput = (data) => {
        return Object.entries(data).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: typeof value === 'string' ? value.trim() : value
        }), {});
    };

    const handlePayLater = async () => {
        if (!validateForm()) {
            return;
        }

        if (cart.length === 0) {
            setErrors(prev => ({ ...prev, cart: 'Please add at least one room to your cart' }));
            return;
        }

        setLoading(true);
        const sanitizedData = sanitizeInput(formData);

        const bookingData = {
            ...sanitizedData,
            cart,
            paymentMethod: 'payLater',
        };

        try {
            const response = await createBooking(bookingData);
            navigate('/CompleteBooking', { state: { booking: response.data } });
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: error.message || 'An error occurred while creating your booking'
            }));
        } finally {
            setLoading(false);
        }
    };

    const handlePayPalSuccess = async (details, data) => {
        if (!validateForm()) {
            return;
        }

        if (cart.length === 0) {
            setErrors(prev => ({ ...prev, cart: 'Please add at least one room to your cart' }));
            return;
        }

        setLoading(true);
        const sanitizedData = sanitizeInput(formData);

        const bookingData = {
            ...sanitizedData,
            cart,
            paymentDetails: details,
            paymentMethod: 'paypal',
            paypalOrderId: data.orderID, // Include PayPal order ID
            paypalPayerId: data.payerID, // Include PayPal payer ID
        };

        try {
            // Create the booking and simultaneously process the PayPal payment
            const [bookingResponse, paymentResponse] = await Promise.all([
                createBooking(bookingData),
                // Assuming you have a function to handle PayPal payment (if needed beyond the success handler)
                processPayPalPayment(details, data)
            ]);

            // After both processes are successful, navigate to the confirmation page
            navigate('/CompleteBooking', { state: { booking: bookingResponse.data } });
        } catch (error) {
            // Handle errors for both booking and payment
            setPaypalError(error.message || 'An error occurred while processing your payment or booking');
        } finally {
            setLoading(false);
        }
    };


    const handlePayPalError = (err) => {
        setPaypalError(err.message || 'An error occurred with PayPal');
    };

    const removeFromCart = (itemId) => {
        removeItemFromCart(itemId);
    };

    const renderField = (name, label, type = 'text') => (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {['firstName', 'lastName', 'email', 'phone', 'address1', 'city', 'zipCode'].includes(name) &&
                    <span className="text-red-500 ml-1">*</span>
                }
            </label>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                    ${errors[name]
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
            />
            {errors[name] && (
                <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
            )}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-6 py-12 flex flex-col lg:flex-row lg:space-x-12">
            <div className="w-full lg:w-2/3">
                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                    <h2 className="text-2xl font-bold mb-4">Guest Information</h2>

                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{errors.submit}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Prefix</label>
                            <select
                                name="prefix"
                                value={formData.prefix}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Select</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Ms.">Ms.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Dr.">Dr.</option>
                            </select>
                        </div>

                        {renderField('firstName', 'First Name')}
                        {renderField('lastName', 'Last Name')}
                        {renderField('phone', 'Phone')}
                        {renderField('email', 'Email', 'email')}
                        {renderField('country', 'Country')}
                        {renderField('address1', 'Address')}
                        {renderField('city', 'City')}
                        {renderField('zipCode', 'ZIP Code')}
                    </div>

                    <h2 className="text-2xl font-bold my-4">Payment Options</h2>
                    <p className="text-gray-600 mb-4">Choose how you would like to pay:</p>

                    {errors.cart && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{errors.cart}</span>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handlePayLater}
                        className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={24} color={"#ffffff"} /> : 'Pay After You Arrive'}
                    </button>

                    <div className="mt-4">
                        <PayPalButton
                            totalAmount={totalAmount}
                            onSuccess={handlePayPalSuccess}
                            onError={handlePayPalError}
                            disabled={loading}
                        />
                    </div>

                    {paypalError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{paypalError}</span>
                        </div>
                    )}
                </form>
            </div>

            <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
                <Cart onUpdateTotalAmount={setTotalAmount} />
            </div>
        </div>
    );
};

export default CheckoutPage;
