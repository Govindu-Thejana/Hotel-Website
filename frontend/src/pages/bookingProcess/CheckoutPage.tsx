// CheckoutPage.js
import React from "react";
import PayPalButton from "../../components/roomBookings/paypalPayment";
import StripePayment from '../../components/roomBookings/stripePayment';
import CheckoutButton from "../../components/roomBookings/checkOutButton";

const CheckoutPage = () => {
    return (
        <div>
            <div>
                <PayPalButton /> //stripe payment(credit or ebit card butoon) is in this component also
            </div>
            <div>
            </div>
        </div>
    );
};

export default CheckoutPage;
