const adminAuth = require('../services/adminlogin');

async function adminLogin(req,res) {
    try {
        const userData = req.body;
        const token = await adminAuth.AdminLogin(userData.email, userData.password); // Await here
        
        res.status(200).json({ message: "  Admin Logged", token });
    } catch (err) {
        res.status(400).json({ message: err.message }); // Use 400 for client errors
    }
}

module.exports = {
    adminLogin
}