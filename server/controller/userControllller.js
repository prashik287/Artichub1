const userService = require('../services/signup');

async function createUser(req, res) {
    try {
        const userData = req.body;
        const user = await userService.createUser(userData);
        res.status(201).json({ user, message: "User Registered" });
    } catch (err) {
        res.status(400).json({ message: err.message }); // Use 400 for client errors
    }
}

module.exports = {
    createUser,
};
