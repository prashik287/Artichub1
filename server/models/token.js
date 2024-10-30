const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

const Token = mongoose.model("token", tokenSchema);
module.exports = Token;