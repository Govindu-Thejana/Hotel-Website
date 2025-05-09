import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    quantity: Number,
    price: Number,
    image: String,
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  orderType: {
    type: String,
    enum: ["Immediate", "Scheduled"],
    default: "Immediate", // Default to immediate orders
  },
  scheduleDateTime: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Delivered", "Cancelled"],
    default: "Pending",
  },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
