const bcrypt = require('bcryptjs');
const Ebuyer = require('../models/Ebuyer');
const Eseller = require('../models/Eseller');
const { generateToken } = require('../utils/jwtUtils');

async function login(email, password, accounttype) {
    let existingUser;

    // Find user based on account type
    if (accounttype === 'buyer') {
        existingUser = await Ebuyer.findOne({ email });
    } else if (accounttype === 'seller') {
        existingUser = await Eseller.findOne({ email });
    }

    if (!existingUser) {
        throw new Error('User does not exist');
    }

    if (!existingUser.verified) {
        throw new Error('User is not verified');
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
        throw new Error('Invalid credentials'); // Trigger error if password doesn't match
    }

    // Generate JWT token if password matches
    const token = generateToken(existingUser);
    console.log(token);

    return token;
}

module.exports = {
    login
};
