const mongoose = require("../db/conn");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // Ensure emails are unique
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
        default: 'buyer'
    },
    dob: { // Date of Birth
        type: String, // Set to String to allow empty initialization
        default: ''   // Initialize as an empty string
    },
    mobileno: { // Mobile Number
        type: String,
        default: ''   // Initialize as an empty string
    },
    address: { // Address
        type: String,
        default: ''   // Initialize as an empty string
    },
    city: { // City
        type: String,
        default: ''   // Initialize as an empty string
    },
    state: { // State
        type: String,
        default: ''   // Initialize as an empty string
    },
    zip: { // Zip Code
        type: String,
        default: ''   // Initialize as an empty string
    },
    country: { // Country
        type: String,
        default: ''   // Initialize as an empty string
    }
}); 

module.exports = mongoose.model('ebuyer', userSchema);
