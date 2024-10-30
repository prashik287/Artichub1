const mongoose = require('mongoose');
const Ebuyer = require('./Ebuyer'); // Adjust the path as necessary

const reviewSchema = new mongoose.Schema({
  buyer: {
    type: String, // Reference to Ebuyer model or User model
    required: true
  },
  rating: {
    type: Number, // Rating out of 5
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String, // Optional review comment
    required: false
  },
  date: {
    type: Date,
    default: Date.now // Automatically set to the date the review is created
  }
});

const artSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  condition: {
    type: String, // New description field for the art product
    required: true, // Making it mandatory
    trim: true // Removes extra spaces from the beginning and end of the string
  },
  Quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,

  },
  image: {
    type: String, // Storing image as base64 string or image path
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Eseller model
    ref: 'Eseller',
    required: true
  },
  saleType: {
    type: String,
    required: true,
    enum: ['sell', 'auction'], // Direct sell or auction
  },
  auctionStartDate: {
    type: Date,
    required: function() {
      return this.saleType === 'auction'; // Only required for auctions
    },
    default: null // Optional default if needed
  },
  auctionEndDate: {
    type: Date,
    required: function() {
      return this.saleType === 'auction'; // Only required for auctions
    },
    default: null // Optional default if needed
  },
  bids: [{
    amount: {
        type: Number,
        required: true
    },
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ebuyer',
        required: true
    },
    bidTime: {
        type: Date,
        default: Date.now
    }
}],

highestBid: {
    amount: {
        type: Number,
        required: false,
        default: 0
    },
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ebuyer',
        required: false
    },
    bidTime: {
        type: Date,
        required: false
    }
},

  reviews: [reviewSchema] // Array of review objects
});

module.exports = mongoose.model('art', artSchema);
