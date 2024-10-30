const mongoose = require("../db/conn");

const sellerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    acctype: {
        type: String,
        default: 'seller'
    },
    storeName: {
        type: String,
        required: true
    },
    storeDescription: {
        type: String
    },
    artProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Art'
    }],
    rating: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: String
    }]
});

module.exports = mongoose.model('eseller', sellerSchema);
