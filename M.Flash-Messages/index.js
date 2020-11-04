const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const sessions = require('express-session');
const flash = require('connect-flash');


const product = require('./models/product');

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
app.use(sessions({secret: "secret", resave: false, saveUninitialized: false}));
app.use(flash());
app.use((req,res,next) => {
    res.locals.message = req.flash('success');
    next();
});

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

app.get("/products/:id", async (req,res) => {
    const { id } = req.params
    const foundProduct = await product.findById(id);
    res.render("product/show",{ foundProduct });
});

app.get("/products/:id/edit", async (req,res) => {
    const { id } = req.params
    const foundProduct = await product.findById(id);
    res.render("product/edit", { foundProduct, categories });
});

app.post("/products", async (req,res) => {
    const newProduct = new product(req.body);
    await newProduct.save();
    req.flash('success', "Successfully created this product");
    res.redirect(`/products/${newProduct._id}`);
})

app.patch("/products/:id", async (req,res) => {
    const { id } = req.params; 
    await product.findByIdAndUpdate(id, req.body, {runValidators: true});
    res.redirect(`/products/${id}`);
});

app.delete("/products/:id", async (req,res) => {
    console.log("sunt aici");
    const { id } = req.params;
    await product.findByIdAndDelete(id);
    res.redirect("/products");
});

app.listen(3000, () => {
    console.log("Server started");
});