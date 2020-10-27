const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const campgroundSchema = require('./models/campground');
const methodOverride = require('method-override');
const { findByIdAndUpdate } = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});

mongoose.connection.on("error", console.error.bind(console, "Error while trying to connect to DB"));
mongoose.connection.once("open", () => {
    console.log("Successfully connected to DB");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.get("/", (req,res) => {
    res.send("It works");
});

app.get("/campgrounds", async (req,res) => {
    const campgrounds = await campgroundSchema.find({});
    res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req,res) => {
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", async (req,res) => {
    const campground = await campgroundSchema.findById(req.params.id);
    res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req,res) => {
    const campground = await campgroundSchema.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
});

app.post("/campgrounds", async (req,res) => {
    await new campgroundSchema(req.body.campground).save().
        then( (newCampground) => {
            res.redirect(`/campgrounds/${newCampground._id}`);
        });
});

app.patch("/campgrounds/:id", async (req,res) => {
    const campground = await campgroundSchema.findByIdAndUpdate(req.params.id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req,res) => {
    await campgroundSchema.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
});

app.listen(3000, () => {
    console.log("Server started");
});