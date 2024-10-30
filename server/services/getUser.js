const Ebuyer = require('../models/Ebuyer')
const Eseller = require('../models/Eseller');

async function retrieveUsers(userData) {
    const { email,acctype } = userData;
    if (!acctype) {
        throw new Error('Account type is required');
    }

    let users;
    if (acctype === 'buyer') {
        users = await Ebuyer.findOne({email : email});
    } else if (acctype === 'seller') {
        users = await Eseller.find({email:email});
    }

    if (!users) {
        throw new Error('No users found for this email');
    }
    // If users are found, return them
    return users

}

module.exports = {
    retrieveUsers
};