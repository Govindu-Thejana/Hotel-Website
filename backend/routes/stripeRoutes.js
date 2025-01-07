import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /checkout: Create a Stripe checkout session
router.post('/checkout', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Node.js and Express book',
            },
            unit_amount: 50 * 100, // 50 USD in cents
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'JavaScript T-Shirt',
            },
            unit_amount: 20 * 100, // 20 USD in cents
          },
          quantity: 2,
        },
      ],
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US', 'BR'],
      },
      success_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    });

    res.redirect(session.url); // Redirect to Stripe's checkout page
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send({ error: error.message });
  }
  console.log(session);
});

// GET /complete: Handle successful payment
router.get('/complete', async (req, res) => {
  try {
    const result = await Promise.all([
      stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['payment_intent.payment_method'] }),
      stripe.checkout.sessions.listLineItems(req.query.session_id),
    ]);

    console.log(JSON.stringify(result));

    res.send('Your payment was successful');
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    res.status(500).send({ error: 'Failed to complete the payment' });
  }
});

// GET /cancel: Handle canceled payment
router.get('/cancel', (req, res) => {
  res.redirect('/');
});

export default router;
