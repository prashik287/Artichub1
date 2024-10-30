const express = require('express');
const router = express.Router();
const { addProduct } = require('../services/product'); // Import the addProduct service

// Route to add a new product, assuming sellerId is in the request
router.post('/add-product', async (req, res) => {
    const { sellerId, productData } = req.body; // Pass sellerId and productData in request

    try {
        const newProduct = await addProduct(productData, sellerId); // Pass productData and sellerId to addProduct
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
