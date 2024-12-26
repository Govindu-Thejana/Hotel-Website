import React, { useEffect } from "react";
import PropTypes from "prop-types";
import CheckoutButton from "./checkOutButton";

const PayPalButton = ({ totalAmount, onSuccess, onError }) => {
    useEffect(() => {
        const clientID = import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX;

        const addPayPalScript = () => {
            const script = document.createElement("script");
            // Add disable-funding parameter to remove card option
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}&currency=USD&components=buttons&disable-funding=card`;
            script.async = true;
            script.onload = () => initPayPalButton();
            script.onerror = () => {
                console.error("PayPal script failed to load.");
                onError(new Error("PayPal script could not be loaded."));
            };
            document.body.appendChild(script);
        };

        const initPayPalButton = () => {
            if (window.paypal) {
                window.paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: totalAmount?.toFixed(2) || "10.00",
                                    },
                                },
                            ],
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then((details) => {
                            console.log(details);
                            window.location.href = "/CompleteBooking";
                        });
                    },
                    onError: (err) => {
                        console.error("Error:", err);
                    },
                    style: {
                        layout: "vertical",
                        color: "gold",
                        shape: "rect",
                        label: "paypal",
                    },
                    // Explicitly disable funding sources except PayPal
                    fundingSource: window.paypal.FUNDING.PAYPAL
                }).render("#paypal-button-container");
            }
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
    }, [totalAmount, onSuccess, onError]);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
            <h2 style={{ marginBottom: "10px", fontSize: "18px", color: "#333" }}>
                Complete Your Payment
            </h2>
            <div
                id="paypal-button-container"
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    margin: " auto",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f9f9f9",
                }}
            >
                {/* stripe Payment Integragtion button is this */}
                <CheckoutButton />
            </div>
            <p style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
                Your total amount is: <strong>${totalAmount?.toFixed(2) || "10.00"}</strong>
            </p>
        </div>
    );
};

PayPalButton.propTypes = {
    totalAmount: PropTypes.number,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
};

export default PayPalButton;