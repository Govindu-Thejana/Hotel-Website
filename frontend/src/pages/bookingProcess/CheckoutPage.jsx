import React, { useContext, useState, useEffect } from 'react';
import { createBooking } from '../../components/utils/ApiFunctions';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import Cart from '../../components/roomBookings/Cart';
import { ClipLoader } from 'react-spinners';
import PayPalButton from '../../components/roomBookings/paypalPayment';

const CheckoutPage = () => {
    const { cart, removeItemFromCart } = useContext(CartContext);
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
        specialRequest: '',
    });

    useEffect(() => {
        const newTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalAmount(newTotal);
    }, [cart]);

    const validateForm = () => {
        const newErrors = {};

        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address1', 'city', 'zipCode'];
        requiredFields.forEach(field => {
            if (!formData[field]?.trim()) {
                newErrors[field] = 'This field is required';
            }
        });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

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
        console.log('PayPal Success Callback - Details:', details);
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
            paypalOrderId: details.id || (data?.orderID || 'unknown'),
            paypalPayerId: details.payer?.payer_id || (data?.payerID || 'unknown'),
        };

        try {
            console.log('Sending booking data:', bookingData);
            const response = await createBooking(bookingData);
            console.log('Booking created:', response.data);
            navigate('/CompleteBooking', { state: { booking: response.data } });
        } catch (error) {
            console.error('Booking creation error:', error);
            setPaypalError(error.message || 'An error occurred while processing your payment or booking');
        } finally {
            setLoading(false);
        }
    };

    const handlePayPalError = (err) => {
        setPaypalError(err.message || 'An error occurred with PayPal');
    };

    const renderField = (name, label, type = 'text') => (
        <div className="relative">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {['firstName', 'lastName', 'email', 'phone', 'address1', 'city', 'zipCode'].includes(name) && (
                    <span className="text-red-500 ml-1">*</span>
                )}
            </label>
            <input
                id={name}
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border transition-all duration-200
                    ${errors[name]
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-scolor focus:ring-scolor focus:border-scolor'
                    } bg-white shadow-sm`}
                placeholder={`Enter ${label.toLowerCase()}`}
            />
            {errors[name] && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors[name]}</p>
            )}
        </div>
    );

    const renderTextArea = (name, label) => (
        <div className="relative">
            <label htmlFor={name} className="block text-sm font-medium text-pcolor mb-1">
                {label}
            </label>
            <textarea
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-scolor focus:border-scolor bg-white shadow-sm transition-all duration-200"
                placeholder="Any special requests?"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">CHECKOUT</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">ENTER YOUR DETAILS</h2>
                                    {errors.submit && (
                                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-fade-in">
                                            {errors.submit}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Prefix</label>
                                            <select
                                                name="prefix"
                                                value={formData.prefix}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 rounded-lg border border-scolor focus:ring-scolor focus:border-scolor bg-white shadow-sm transition-all duration-200"
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
                                    <div className="mt-6">
                                        {renderTextArea('specialRequest', 'Special Request (Optional)')}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Options</h2>
                                    {errors.cart && (
                                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-fade-in">
                                            {errors.cart}
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <button
                                            type="button"
                                            onClick={handlePayLater}
                                            disabled={loading}
                                            className="w-full py-3 px-6 bg-scolor text-white rounded-lg font-medium hover:bg-pcolor disabled:bg-pcolor disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                                        >
                                            {loading ? (
                                                <ClipLoader size={24} color="#ffffff" />
                                            ) : (
                                                'Pay After You Arrive'
                                            )}
                                        </button>

                                        {/* <div className="relative">
                                            <PayPalButton
                                                totalAmount={totalAmount}
                                                onSuccess={handlePayPalSuccess}
                                                onError={handlePayPalError}
                                                disabled={loading}
                                            />
                                            {loading && (
                                                <div className="absolute inset-0 bg-gray-200 bg-opacity-50 rounded-lg flex items-center justify-center">
                                                    <ClipLoader size={24} color="#4f46e5" />
                                                </div>
                                            )}
                                        </div>

                                        {paypalError && (
                                            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-fade-in">
                                                {paypalError}
                                            </div>
                                        )} */}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                            <Cart onUpdateTotalAmount={setTotalAmount} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;