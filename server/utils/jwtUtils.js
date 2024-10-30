const jwt = require('jsonwebtoken');
const { secretkey } = require('../config/jwtConfig')
const generateToken = (user )=>{
    const payload = {
        user
    }
    return jwt.sign(payload,secretkey,{expiresIn : "1h"})
}
module.exports = {
    generateToken
}