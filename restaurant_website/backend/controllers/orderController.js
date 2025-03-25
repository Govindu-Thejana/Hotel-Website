import mongoose from "mongoose";
import Order from "../models/order.js";

export const createOrder = async (req, res) => {
  try {
    const { name, email, street, city, country, zipCode, paymentMethod, items, totalAmount, userId, cart } = req.body;
    console.log('Request Body:', req.body);
    console.log('items:', items);

    if (!name || !email || !street || !city || !zipCode || !paymentMethod || !items || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new Order({
      name,
      email,
      shippingAddress: { street, city, country, zipCode },
      paymentMethod,
      items,
      totalAmount,
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const Orders = await Order.find({});
    return res.status(200).json({
      count: Orders.length,
      data: Orders
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders.length ? orders : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order status updated successfully", order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};


export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const addItemToOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.items.push(req.body);
    order.totalAmount += req.body.price * req.body.quantity;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeItemFromOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const itemIndex = order.items.findIndex((item) => item._id.toString() === req.params.itemId);
    if (itemIndex === -1) return res.status(404).json({ message: "Item not found in order" });

    // Deduct the item price from the total amount
    order.totalAmount -= order.items[itemIndex].price * order.items[itemIndex].quantity;

    // Remove the item from the array
    order.items.splice(itemIndex, 1);

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const stats = await Order.aggregate([
      { $match: { userId: userId } }, // Ensure it's an ObjectId
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          averageOrderValue: { $avg: "$totalAmount" },
        },
      },
    ]);
    res.json(stats[0] || { totalOrders: 0, totalSpent: 0, averageOrderValue: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
