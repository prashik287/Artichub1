const bcrypt = require('bcryptjs')
const  admin = require('../models/admin');
const { generateToken } = require('../utils/jwtUtils');

async function AdminLogin(email,password) {
    const existingUser = await admin.findOne({ email });
    if (!existingUser) {

        throw new Error('User Not Exist');
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    console.log(passwordMatch);
    console.log(existingUser);
    if (!passwordMatch) {
        throw new Error('Invalid credential error'); 
    }

    const token = generateToken(existingUser);
    console.log(token);
    return token;

    
}

module.exports = {
    AdminLogin
}