// Import necessary modules
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Import mongoose for ObjectId
const Eseller = require('../models/Eseller'); // Import the Ebuyer (Seller) model

// Route to get seller data by sellerId
router.get('/seller/:sellerId', async (req, res) => {
  const { sellerId } = req.params;
  console.log(sellerId)
  try {
    // Check if sellerId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: 'Invalid seller ID format' });
    }

    // Find the seller by sellerId using 'new' keyword for ObjectId
    const seller = await Eseller.findOne({ _id: new mongoose.Types.ObjectId(sellerId) });

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Return the seller data
    res.json(seller);
  } catch (error) {
    console.error('Error fetching seller data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
