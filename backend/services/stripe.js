import Stripe from "stripe";

// Initialize Stripe with the secret key from the environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Define the store items and their prices
const storeItems = new Map([
    [1, { priceInCents: 10000, name: "Learn React Today" }],
    [2, { priceInCents: 20000, name: "Learn CSS Today" }],
]);

// Get the base URL from environment variables
const baseUrl = process.env.BASE_URL || "http://localhost:5173"; // Fallback to default if not set

// Create Checkout Session route
const createCheckoutSession = async (req, res) => {
    try {
        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: req.body.items.map((item) => {
                const storeItem = storeItems.get(item.id);
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: storeItem.name,
                        },
                        unit_amount: storeItem.priceInCents,
                    },
                    quantity: item.quantity,
                };
            }),
            success_url: `${process.env.BASE_URL}/bookingComplete`,
            cancel_url: `${process.env.BASE_URL}/checkout`,
        });

        // Return the session URL to redirect to the payment page
        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Export the route handler
export { createCheckoutSession };
