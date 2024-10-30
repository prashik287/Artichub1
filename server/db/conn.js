const mongoose = require('mongoose');
require('dotenv').config()
const MongooseURL = process.env.MONGOOSE_URL
mongoose.connect(MongooseURL)  

mongoose.connection.on('connected' , () => {
    console.log("Mongoose is connected");
})

mongoose.connection.on('error' , (err) => {
    console.log("Mongoose connection error : ", err);
})

module.exports = mongoose
