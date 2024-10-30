const buyController = require('../controllers/buyController');
const express = require('express');
const cors = require('cors');
const router = express.Router();
const Product = require('../models/Products'); // Your Product model
const Order = require('../models/Order'); // Your Order model
const crypto = require('crypto');
const Razorpay = require('razorpay');

router.use(cors());
const razorpay = new Razorpay({
  key_id: process.env.RAZOR_KEY, // Use environment variables for your Razorpay credentials
  key_secret: process.env.RAZOR_SECRET,
});

router.post('/buy/:productId', buyController.buyart);

router.post('/checkout', async (req, res) => {
  try {
    const { productId, userId, quantity, paymentMethod, address, city, state, zipCode, country } = req.body;

    // Create an array of missing fields
    const missingFields = [];
    if (!productId) missingFields.push('productId');
    if (!userId) missingFields.push('userId');
    if (!quantity) missingFields.push('quantity');
    if (!paymentMethod) missingFields.push('paymentMethod');
    if (!address) missingFields.push('address');
    if (!city) missingFields.push('city');
    if (!state) missingFields.push('state');
    if (!zipCode) missingFields.push('zipCode');
    if (!country) missingFields.push('country');

    // If any fields are missing, return an error and log the missing fields
    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields.join(', '));
      return res.status(400).json({ success: false, message: `Missing fields: ${missingFields.join(', ')}` });
    }

    // Fetch product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    console.log(userId)
    console.log(product.seller)
    // Check if the product belongs to the user
    if (product.seller.toString() === userId.toString()) {
      return res.status(403).json({ success: false, message: 'Sellers cannot purchase their own products' });
    }

    // Validate quantity
    if (quantity <= 0 || quantity > product.stock) {
      return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    // Calculate total amount (convert to smallest currency unit, e.g., paise for INR)
    const totalAmount = product.price * quantity * 100; // Amount in paise for INR

    // Create a new Razorpay order
    const options = {
      amount: totalAmount,
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex'),
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    console.log('Razorpay Order:', order);

    // Save the order details in your database
    const newOrder = new Order({
      userId,
      productId,
      quantity,
      totalPrice: totalAmount / 100, // Convert back to normal units (INR)
      paymentStatus: 'pending',
      razorpayOrderId: order.id,
      shippingAddress: {
        address,
        city,
        state,
        zipCode,
        country,
      },
      paymentMethod,
    });

    await newOrder.save();

    // Reduce product stock
    product.stock -= quantity;
    await product.save();

    // Send the order id and key_id to the frontend
    res.status(201).json({
      success: true,
      OrderId: newOrder._id,
      orderId: order.id,
      key: process.env.RAZOR_KEY, // Send the Razorpay key id to the client
      amount: totalAmount,
      currency: 'INR',
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ success: false, message: 'An error occurred during checkout' });
  }
});

router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    // Construct the expected signature from razorpay_order_id and razorpay_payment_id
    const hmac = crypto.createHmac('sha256', process.env.RAZOR_SECRET); // Use the correct secret
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      // Payment is successful and verified
      const order = await Order.findOne({ _id: order_id });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Update the order status to paid
      order.paymentStatus = 'paid';
      await order.save();

      // Reduce product stock only after successful payment
      const product = await Product.findById(order.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Ensure that the stock can still be reduced (in case stock was updated after checkout)
      if (product.Quantity >= order.quantity) {
        product.Quantity -= order.quantity;
        await product.save();
      } else {
        return res.status(400).json({ success: false, message: 'Insufficient stock' });
      }

      res.status(200).json({ success: true, message: 'Payment verified and stock updated successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});


module.exports = router;
