const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    location: String
});

module.exports = mongoose.model("Campground", campgroundSchema);