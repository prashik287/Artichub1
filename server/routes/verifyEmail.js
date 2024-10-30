const express = require('express');
const cors = require('cors');
const router = express.Router();
const Token = require('../models/token');
const Ebuyer = require('../models/Ebuyer');
const Eseller = require('../models/Eseller');

router.use(cors());

router.get('/verify/:id/:token', async (req, res) => {
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

        // Check if token exists before accessing _id
        if (!token) {
            console.error("Invalid token");
            return res.status(400).send("Invalid link: Token not found");
        }

        console.log("Token found with ID:", token._id);

        // Mark user as verified
        user.verified = true;
        await user.save();

        // Remove the used token from the database by its _id
        await Token.findOneAndDelete({ _id: token._id });

        res.redirect("http://127.0.0.1:3000/verification-success");
    } catch (error) {
        console.error("Error during email verification:", error);
        res.status(500).send("An error occurred during verification");
    }
});

module.exports = router;
