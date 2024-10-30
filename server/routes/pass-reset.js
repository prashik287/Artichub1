const express = require('express');
const emailController = require('../controllers/passreset');
const cors = require('cors');
const Ebuyer = require('../models/Ebuyer');
const router = express.Router();
const Token = require('../models/token');
const bcrypt = require('bcryptjs')
router.use(cors());

router.post('/reset', emailController.resetPassword);


// Password reset endpoint (POST request instead of GET)
router.get("/:userId/:token", async (req, res) => {
    try {
        const { password } = req.body;

        // Check if password is provided
        if (!password) return res.status(400).send("Password is required");

        // Find the user by ID
        const user = await Ebuyer.findById(req.params.userId);
        if (!user) return res.status(400).send("Invalid link or expired");

        // Find the token
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword; // Set the hashed password
        await user.save();

        // Remove the token from the database after successful password reset
        await Token.findOneAndDelete({ _id: token._id });

        res.send("Password reset successfully.");
    } catch (error) {
        res.status(500).send("An error occurred during password reset.");
        console.error(error);
    }
});

module.exports = router;

