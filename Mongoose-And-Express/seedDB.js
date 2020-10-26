const mongoose = require('mongoose');

const product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/shopInventory', {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    console.log("Successfully connected to database");
})
.catch( err => {
    console.log("Error while trying to connect to database");
    console.log(err);
});

const insertArray = [
    {
        name: "Tomatoes",
        price: 1.99,
        category: "vegetable",
        quantity: 10
    },
    {
        name: "Apples",
        price: 2.99,
        category: "fruit",
        quantity: 5
    },
    {
        name: "Pears",
        price: 3.99,
        category: "fruit",
        quantity: 15
    },
    {
        name: "Potatoes",
        price: 0.99,
        category: "vegetable",
        quantity: 23
    },
]

product.insertMany(insertArray).
then( (data) => {
    console.log("Successfully inserted data into DB");
    console.log(data);
}).
catch ( (err) => {
    console.log("Error while trying to insert data into DB");
    console.log(err);
})