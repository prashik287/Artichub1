const retrieveService = require('../services/getUser')


async function retrieveusers(req,res) {
    try {
        const userData = req.body;
        const users = await retrieveService.retrieveUsers(userData)
        res.status(200).json({ users })
    } catch (error) {
        res.status(400).json({ error: error.message }); // Use 400 for client errors
    }
}

module.exports = {
    retrieveusers
}