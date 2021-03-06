const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Product = require('./models/product');
const Farm = require("./models/farm");

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

app.get("/farms/new", (req,res) => {
    res.render("farms/new");
});

app.post("/farms", async (req,res) => {
    await new Farm(req.body).save();
    res.redirect("/farms");
});

app.get("/farms", async (req,res) => {
    const farms = await Farm.find({});
    res.render("farms/index", { farms });
});

app.get("/farms/:id", async (req,res) => {
    const farm = await Farm.findById(req.params.id).populate("products");
    res.render("farms/show", { farm });
});

app.get("/farms/:id/products/new", async (req,res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render("product/new", { categories, farm }); 
});

app.post("/farms/:id/products", async (req,res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    const product = new Product(req.body);
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    res.redirect(`/farms/${id}`)
});

app.delete("/farms/:id", async (req,res) => {
    await Farm.findByIdAndDelete(req.params.id);
    res.redirect("/farms");
});

app.get("/products", async (req,res) => {
    let { category } = req.query;
    let products = [];
    if(category){
        products = await Product.find({ category });
    } else {
        products = await Product.find({});
        category = "All";
    }
    res.render("product/index", { products, category });

});

app.get("/products/new", (req,res) => {
    res.render("product/new", { categories });
});

app.get("/products/:id", async (req,res) => {
    const { id } = req.params
    const foundProduct = await Product.findById(id).populate("farm","name");
    res.render("product/show",{ foundProduct });
});

app.get("/products/:id/edit", async (req,res) => {
    const { id } = req.params
    const foundProduct = await Product.findById(id);
    res.render("product/edit", { foundProduct, categories });
});

app.post("/products", async (req,res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
})

app.patch("/products/:id", async (req,res) => {
    const { id } = req.params; 
    await Product.findByIdAndUpdate(id, req.body, {runValidators: true});
    res.redirect(`/products/${id}`);
});

app.delete("/products/:id", async (req,res) => {
    console.log("sunt aici");
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/products");
});

app.listen(3000, () => {
    console.log("Server started");
});