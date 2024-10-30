const resendservice = require('../services/resendmail');

async function resendVerificationEmail(req, res) {
    try {
        const userData = req.body;

        // Resend verification email
        const user = await resendservice.resendemail(userData);

        // Send success response
        res.status(201).json({ user, message: "Check your inbox for verification email" });
    } catch (error) {
        console.error("Error in controller:", error.message);

        // Send error response with appropriate message
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    resendVerificationEmail
};
