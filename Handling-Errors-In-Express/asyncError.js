const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const customError = require("./CustomError");

const product = require('./models/product');
const CustomError = require('./CustomError');

mongoose.connect('mongodb://localhost:27017/shopInventory', {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    console.log("Successfully connected to database");
})
.catch( err => {
    console.log("Error while trying to connect to database");
    console.log(err);
});

app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

var categories = ['fruit', 'vegetable'];

app.get("/products", async (req,res) => {
    let { category } = req.query;
    console.log(category);
    let products = [];
    if(category){
        products = await product.find({ category });
    } else {
        products = await product.find({});
        category = "All";
    }
    res.render("product/index", { products, category });

});

app.get("/products/new", (req,res) => {
    res.render("product/new", { categories });
});

app.get("/products/:id", async (req,res,next) => {
    const { id } = req.params
    const foundProduct = await product.findById(id);

    if(!foundProduct){
        return next(new CustomError(404,"Did not find this product"));
    }
    res.render("product/show",{ foundProduct });
});

app.get("/products/:id/edit", async (req,res) => {
    const { id } = req.params
    const foundProduct = await product.findById(id);

    if(!foundProduct){
        return next(new CustomError(404,"Did not find this product"));
    }
    res.render("product/edit", { foundProduct, categories });
});

app.post("/products", async (req,res) => {
    const newProduct = new product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
})

app.patch("/products/:id", async (req,res) => {
    const { id } = req.params; 
    await product.findByIdAndUpdate(id, req.body, {runValidators: true});
    res.redirect(`/products/${id}`);
});

app.delete("/products/:id", async (req,res) => {
    const { id } = req.params;
    await product.findByIdAndDelete(id);
    res.redirect("/products");
});

app.use((err,req,res,next) => {
    const { status = 500, message = "Something went wrong"} = err;
    res.status(status).send(message);
});

app.listen(3000, () => {
    console.log("Server started");
});