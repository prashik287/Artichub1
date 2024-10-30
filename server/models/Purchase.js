const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Purchase schema
const purchaseSchema = new Schema({
  buyerId: {
    type: Schema.Types.ObjectId, 
    ref: 'Ebuyer',  // Reference to the buyer model
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId, 
    ref: 'Product',  // Reference to the product model
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1']
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price cannot be less than 0']
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Credit Card', 'PayPal', 'Debit Card', 'Bank Transfer'], // Valid payment methods
    default: 'Credit Card'
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  purchaseDate: {
    type: Date,
    default: Date.now  // Automatically set the purchase date to the current time
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],  // Order statuses
    default: 'Pending'
  }
});

// Export the Purchase model
const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
