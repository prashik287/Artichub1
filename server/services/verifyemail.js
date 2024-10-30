const Token = require('../models/token');
const Ebuyer = require('../models/Ebuyer');
const Eseller = require('../models/Eseller');

async function verifyemail(req, res) {
    try {
        // Find the user by ID in either Ebuyer or Eseller collection
        let user = await Ebuyer.findOne({ _id: req.params.id }) || await Eseller.findOne({ _id: req.params.id });
        
        if (!user) {
            console.error("Invalid user ID");
            return res.status(400).send("Invalid link: User not found");
        }

        // Find the token associated with the user
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });

        // Handle case when the token is not found
        if (!token) {
            console.error("Invalid token or token expired");
            return res.status(400).send("Invalid or expired token");
        }

        // Optional: Check for token expiration, if you have an expiration field
        if (token.expiresAt && token.expiresAt < Date.now()) {
            console.error("Token expired");
            return res.status(400).send("Token has expired");
        }

        // Mark user as verified
        user.verified = true;
        await user.save();

        // Remove the used token from the database
        await Token.findOneAndDelete({ _id: token._id });

        // Redirect to success page
        res.redirect("http://127.0.0.1:3000/verification-success");
    } catch (error) {
        console.error("Error during email verification:", error);
        res.status(500).send("An error occurred during verification");
    }
}

module.exports = {
    verifyemail,
};
