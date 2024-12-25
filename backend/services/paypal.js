import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const generateAccessToken = async () => {
    try {
        const response = await axios({
            url: `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
            method: 'post',
            data: 'grant_type=client_credentials',
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET,
            },
        });
        console.log(response.data);
        return response.data.access_token;
    } catch (error) {
        console.error('Error generating access token:', error);
        throw new Error('Unable to generate PayPal access token');
    }
};


export const createOrder = async () => {
    try {
        const accessToken = await generateAccessToken();
        console.log('access_token = ', accessToken);

        const response = await axios({
            url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            data: {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        items: [
                            {
                                name: 'Room Booking',
                                description: 'Room Booking Details',
                                quantity: 1,
                                unit_amount: {
                                    currency_code: 'USD',
                                    value: '10.00',
                                },
                            },
                        ],
                        amount: {
                            currency_code: 'USD',
                            value: '10.00',
                            breakdown: {
                                item_total: {
                                    currency_code: 'USD',
                                    value: '10.00',
                                },
                            },
                        },
                    },
                ],
                application_context: {
                    return_url: `${process.env.BASE_URL}/CompleteBooking`,
                    cancel_url: `${process.env.BASE_URL}/cancel-order`,
                    shipping_preference: 'NO_SHIPPING',
                    user_action: 'PAY_NOW',
                    brand_name: 'manfra.io',
                },
            },
        });
        console.log(response.data);
        return response.data.links.find((link) => link.rel === 'approve').href;
    } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Unable to create PayPal order');
    }
};


export const capturePayment = async (orderId) => {
    const accessToken = await generateAccessToken();

    const response = await axios({
        url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};
