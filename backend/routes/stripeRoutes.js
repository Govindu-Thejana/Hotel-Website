import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/checkout', async (req, res) => {
  try {
    const { items, paymentMethod, success_url, cancel_url, totalAmount, formData } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in cart." });
    }

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd', // Ensure this matches your currency
        unit_amount: item.unit_amount, // Price in cents
        product_data: {
          name: item.room.roomType, // Room Type
          description: `Check-in: ${item.checkIn}, Check-out: ${item.checkOut}`, // Include check-in/out
        },
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url,
      metadata: {
        paymentMethod: paymentMethod,
        totalAmount: totalAmount,
        formData: JSON.stringify(formData),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    res.status(500).json({ error: 'Failed to create Stripe session.' });
  }
});

export default router;
