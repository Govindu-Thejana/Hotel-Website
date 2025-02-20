import React from "react";

const CheckoutButton = () => {
    const handleCheckout = () => {
        fetch("https://hotel-website-backend-drab.vercel.app/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items: [
                    { id: 1, quantity: 3 },
                    { id: 2, quantity: 1 },
                ],
            }),
        })
            .then((res) => {
                if (res.ok) return res.json();
                return res.json().then((json) => Promise.reject(json));
            })
            .then(({ url }) => {
                // Redirect to Stripe Checkout
                window.location = url;
            })
            .catch((e) => {
                console.error("Error during checkout:", e.message);
            });
    };

    return (

        <button
            onClick={handleCheckout}
            className="w-full bg-gray-800 text-white rounded flex items-center justify-center py-3 px-4 hover:bg-gray-700 transition-colors"
        >
            <svg
                className="mr-2"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            Debit or Credit Card
        </button>

    );
};

export default CheckoutButton;
