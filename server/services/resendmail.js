const Token = require('../models/token');
const Ebuyer = require('../models/Ebuyer');
const Eseller = require('../models/Eseller');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // Assuming this is your email utility

async function resendemail(userData) {
    try {
        if (!userData.email) {
            throw new Error('Email is required');
        }

        let user;

        if (userData.acctype === 'buyer') {
            user = await Ebuyer.findOne({ email: userData.email });
        } else if (userData.acctype === 'seller') {
            user = await Eseller.findOne({ email: userData.email });
        } else {
            throw new Error('Invalid account type'); // Error message for invalid account type
        }

        if (!user) {
            throw new Error('User not found with the provided email'); // Handle case if user not found
        }

        const token = new Token({
            userId: user._id,
            token: crypto.randomBytes(16).toString('hex')
        });

        await token.save();

        const message = `${process.env.BASE_URL}/email/verify/${user._id}/${token.token}`;
        await sendEmail(user.email, "Verify Email", message); // Fixed: use `user.email` instead of undefined `email`

        return user;
    } catch (error) {
        console.error("Error while sending email:", error);
        throw new Error(error.message); // Re-throw the error to be handled by the controller
    }
}

module.exports = {
    resendemail
};
