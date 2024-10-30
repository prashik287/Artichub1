const Ebuyer = require('../models/Ebuyer');
const Eseller = require('../models/Eseller');
const sendEmail = require("../utils/sendEmail");
const bcrypt = require('bcryptjs');
const Token = require('../models/token');
const crypto = require('crypto');

async function createUser(userData) {
    const { firstName, lastName, email, password, acctype, storeName } = userData;
    
    // Check for required fields common to both buyer and seller
    if (!firstName || !lastName || !email || !password || !acctype) {
        throw new Error('All fields are required');
    }
    console.log(acctype)
    // For sellers, validate the storeName
    if (acctype === 'seller' && !storeName) {
        throw new Error('Store name is required for sellers');
    }
    
    let existingUser;
    if (acctype === 'buyer') {
        existingUser = await Ebuyer.findOne({ email });
    } else if (acctype === 'seller') {
        existingUser = await Eseller.findOne({ email });
    }

    if (existingUser) {
        throw new Error('User already exists');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    
    if (acctype === 'buyer') {
        user = await Ebuyer.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            acctype: 'buyer'
        });
    } else if (acctype === 'seller') {
        user = await Eseller.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            acctype: 'seller',
            storeName  // Add the storeName field for sellers
        });
    }

    const token = new Token({
        userId: user._id,
        token: crypto.randomBytes(16).toString('hex')
    });
    await token.save();

    const message = `${process.env.BASE_URL}/email/verify/${user.id}/${token.token}`;
    await sendEmail(email, "Verify Email", message);
    
    return user;
}

module.exports = {
    createUser
};
