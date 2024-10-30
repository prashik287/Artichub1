// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Adjust the path as needed
const mongoose = require('mongoose');

// Route to get orders for a specific userID
router.get('/:userId/orders', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find orders for the specific userId
    const orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) }); // Use find to get an array

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
