import React, { useEffect, useContext } from "react";
import { CartContext } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import CheckoutButton from "./checkOutButton";
import { differenceInDays } from 'date-fns';

const PayPalButton = ({ totalAmount, onSuccess, onError, disabled, data }) => {
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    // Calculate the total amount from cart if not provided via props
    const calculateOverallTotal = () => {
        if (totalAmount) return totalAmount; // Use prop if provided
        return cart.reduce((total, item) => {
            const nights = differenceInDays(new Date(item.checkOut), new Date(item.checkIn));
            const perNightRate = item.totalAmount / nights;
            const addonsTotal = item.addons.reduce((sum, addon) => sum + addon.price, 0);
            const basePrice = item.totalAmount;
            const vat = (basePrice + addonsTotal) * 0.1;
            const serviceFee = 3.00;
            const itemTotal = basePrice + addonsTotal + vat + serviceFee;
            return total + itemTotal;
        }, 0);
    };

    useEffect(() => {
        const clientID = import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX;

        const addPayPalScript = () => {
            const script = document.createElement("script");
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}&currency=USD&components=buttons&disable-funding=card`;
            script.async = true;
            script.onload = () => initPayPalButton();
            script.onerror = () => {
                console.error("PayPal script failed to load.");
                if (onError) onError(new Error("PayPal script failed to load"));
            };
            document.body.appendChild(script);
        };

        const initPayPalButton = () => {
            if (window.paypal) {
                window.paypal.Buttons({
                    createOrder: (data, actions) => {
                        const total = calculateOverallTotal();
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: total.toFixed(2),
                                    },
                                    description: `Booking for ${cart.length} room(s)`,
                                    custom_id: `BOOKING-${Date.now()}`,
                                    soft_descriptor: "Hotel Booking",
                                },
                            ],
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then((details) => {
                            console.log("Payment completed:", details);
                            // Call the onSuccess prop with payment details
                            if (onSuccess) onSuccess(details, data);
                        });
                    },
                    onError: (err) => {
                        console.error("Payment Error:", err);
                        // Call the onError prop with the error
                        if (onError) onError(err);
                    },
                    style: {
                        layout: "vertical",
                        color: "gold",
                        shape: "rect",
                        label: "paypal",
                    },
                    fundingSource: window.paypal.FUNDING.PAYPAL
                }).render("#paypal-button-container");
            }
        };

        const handlePaymentSuccess = (details) => {
            // Store payment details or booking confirmation
            console.log("Payment Successful!", details);

            // You might want to store the transaction ID
            const transactionID = details.id;

            // You can add API calls here to update your backend
            // await updateBookingStatus(transactionID);

            // Navigate to completion page
            navigate("/CompleteBooking");
        };

        const handlePaymentError = (error) => {
            console.error("Payment Failed:", error);
            // Handle payment failure (show error message, etc.)
        };

        if (!window.paypal) {
            addPayPalScript();
        } else {
            initPayPalButton();
        }

        return () => {
            const script = document.querySelector(`script[src*="${clientID}"]`);
            if (script) document.body.removeChild(script);
        };
    }, [cart, navigate, onSuccess, onError, totalAmount, disabled]);

    return (
        <div className="bg-white p-4 rounded-2xl shadow-lg">
            <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Complete Your Payment
                </h2>
                <div className="w-full max-w-md mb-4">
                    <div className="bg-gray-50 p-4 rounded-xl mb-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="text-xl font-bold text-gray-800">
                                ${calculateOverallTotal().toFixed(2)}
                            </span>
                        </div>
                    </div>
                    <div
                        id="paypal-button-container"
                        className={`w-full bg-white p-4 rounded-xl border border-gray-200 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
                    />
                    <div className="mt-4">
                        <CheckoutButton />
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                    Your booking will be confirmed after successful payment
                </p>
            </div>
        </div>
    );
};

PayPalButton.propTypes = {
    totalAmount: PropTypes.number,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    disabled: PropTypes.bool,
};

export default PayPalButton;