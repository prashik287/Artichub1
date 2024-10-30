const Token = require('../models/token');
const Ebuyer = require('../models/Ebuyer');
const Eseller = require('../models/Eseller');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

async function passreset(userData) {
    try {
        const { email , acctype } = userData;
        if (!email || !acctype) {
            throw new Error('All fields are required');
        }
        let user;
        // Determine the user type and find the user by email
        if (userData.acctype === 'buyer') {
            user = await Ebuyer.findOne({ email: email });
        } else if (userData.acctype === 'seller') {
            user = await Eseller.findOne({ email: email }); // Corrected to query Eseller model
        }

        // If user is not found, throw an error
        if (!user) {
            throw new Error(`Couldn't find user with email: ${email}`);
        }

        // Create a new token and save it to the database
        const token = new Token({
            userId: user._id,
            token: crypto.randomBytes(16).toString('hex')
        });
        await token.save(); // Await the save operation

        // Generate the password reset link including the token
        const link = `${process.env.BASE_URL}/resetpassword/${user._id}/${token.token}`;

        // Send the password reset email
        await sendEmail(userData.email, "Reset Password", `Click on this link to reset your password: ${link}`);

        return { message: "Password reset link has been sent" };
    } catch (error) {
        // Log the error and throw it to the controller to handle the response
        console.error("Error during password reset:", error);
        throw new Error("An error occurred during password reset. Please try again.");
    }
}

module.exports = {
    passreset
};
