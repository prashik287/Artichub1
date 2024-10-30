const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = async (email, subject, text) => {
    try {
        // Create a transporter using Gmail SMTP settings
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false, // For development, set to true in production if using SSL
            auth: {
              user:process.env.SENDER,
              pass:process.env.SENDER_PASS
              // Ensure this is correct
            },
            tls: {
                rejectUnauthorized: false // Avoid in production; better for local testing
            }
        });

        // Send the email
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Corrected to match the user field
            to: email,
            subject: subject,
            text: text
        });

        console.log("Email Sent Successfully");
    } catch (error) {
        console.log("Email Not Sent");
        console.log("Error:", error);
    }
};
