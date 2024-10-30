const Message = require('../models/message')

async function sendfeed  (userFeed){
    const { name, email, subject, message } = userFeed;
    if (!name || !email || !subject || !message) {
        throw new Error('All fields are required');
    }
    const newMsg = await Message.create({
        name,
        email,
        subject,
        message
    })
    return newMsg;
}

module.exports = {
    sendfeed
}