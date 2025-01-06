import express from "express";
import { createOrder, capturePayment } from "../services/paypal.js";

const router = express.Router();

// Route to create a PayPal order
router.post("/pay", async (req, res) => {
    try {
        const url = await createOrder();
        res.redirect(url);
    } catch (error) {
        console.error('Error during payment creation:', error.message);
        res.status(500).send("Error: " + error.message);
    }
});

// Route to capture a PayPal payment
router.get("/CompleteBooking", async (req, res) => {
    try {
        await capturePayment(req.query.token);
        res.send("Course purchased successfully");
    } catch (error) {
        console.error('Error during payment capture:', error.message);
        res.status(500).send("Error: " + error.message);
    }
});

// Route to handle order cancellation and return to the previous page
router.get("/cancel-order", (req, res) => {
    const returnTo = req.query.returnTo || '/'; // Default to home page if no returnTo parameter is provided
    res.redirect(returnTo);
});

export default router;
