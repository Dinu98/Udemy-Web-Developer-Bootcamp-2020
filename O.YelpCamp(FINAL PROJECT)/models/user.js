const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passLocMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passLocMongoose);

module.exports = mongoose.model('User', userSchema);