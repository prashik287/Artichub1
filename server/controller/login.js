const authService = require('../services/login');

async function login(req, res) {
    try {
        const userData = req.body;
        const token = await authService.login(userData.email, userData.password,userData.acctype); // Await here
        
        res.status(200).json({ message: "User Logged", token });
    } catch (err) {
        res.status(400).json({ message: err.message }); // Use 400 for client errors
    }
}

module.exports = {
    login
};
