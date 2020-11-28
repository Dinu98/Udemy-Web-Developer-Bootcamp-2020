const { text } = require('express');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:[true,"Your username cannot be empty"]
    },
    password:{
        type: String,
        required:[true,"Your password cannot be empty"]
    }
});

module.exports = mongoose.model("User",userSchema);