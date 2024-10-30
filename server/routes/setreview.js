const express = require('express');
const router = express.Router();
const Art = require('../models/Products'); // Assuming 'art' is the product model
const Ebuyer = require('../models/Ebuyer'); // Assuming 'Ebuyer' is the buyer model
const cors = require('cors')
const mongoose = require('mongoose')
router.use(cors())
// GET reviews for a specific product
router.get('/reviews/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Art.findById(productId).populate('reviews.buyer', 'firstName lastName');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product.reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new review for a specific product
router.post('/reviews/:productId', async (req, res) => {
  const { productId } = req.params;
  // console.log(productId)
  const { email,rating, comment } = req.body;
   // Assuming user is authenticated

  try {
    const product = await Art.findOne({ _id :new mongoose.Types.ObjectId(productId)});
    console.log(product)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const buyer = await Ebuyer.findOne({ email : email});
    if (!buyer) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newReview = {
      buyer: buyer.email,
      rating,
      comment,
    };

    product.reviews.push(newReview);
    await product.save();

    res.status(201).json({
      success: true,
      review: newReview,
      message: 'Review added successfully',
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
