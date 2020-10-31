const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    category: {
        type: String,
        enum: ['fruit', 'vegetable'],
        lowercase: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    }
});

const Product = mongoose.model("product",productSchema);

module.exports = Product;