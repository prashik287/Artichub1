const Order = require('../models/Order')
const createOrder = async (req, res) => {
    try {
      const { buyerId, products, totalAmount } = req.body;  // Use buyerId here
  
      const order = new Order({
        buyerId,        // Set buyerId
        products,
        totalAmount
      });
  
      await order.save();
      res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
      console.error('Checkout error:', error);
      res.status(500).json({ message: 'Order creation failed', error });
    }
  };
  