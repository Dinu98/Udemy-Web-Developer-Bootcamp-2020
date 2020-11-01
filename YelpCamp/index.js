const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const campgroundSchema = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { findByIdAndUpdate } = require('./models/campground');
const catchAsync = require("./utils/catchAsync");
const ExpressError = require('./utils/ExpressError');
const validateSchemas = require('./validateSchemas');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});

mongoose.connection.on("error", console.error.bind(console, "Error while trying to connect to DB"));
mongoose.connection.once("open", () => {
    console.log("Successfully connected to DB");
});

app.engine('ejs', ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

const validateData = (req,res,next) => {
    const validateCampgroundsSchema = validateSchemas.schemas.campgroundsSchema;

    const { error } = validateCampgroundsSchema.validate(req.body);

    if(error){
        const message = error.details.map(el => el.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

app.get("/", (req,res) => {
    res.send("It works");
});

app.get("/campgrounds", catchAsync(async (req,res) => {
    const campgrounds = await campgroundSchema.find({});
    res.render("campgrounds/index", { campgrounds });
}));

app.get("/campgrounds/new", (req,res) => {
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", catchAsync(async (req,res) => {
    const campground = await campgroundSchema.findById(req.params.id);
    res.render("campgrounds/show", { campground });
}));

app.get("/campgrounds/:id/edit", catchAsync(async (req,res) => {
    const campground = await campgroundSchema.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
}));

app.post("/campgrounds", validateData, catchAsync(async (req,res) => {
    await new campgroundSchema(req.body.campground).save().
        then( (newCampground) => {
            res.redirect(`/campgrounds/${newCampground._id}`);
        });
}));

app.patch("/campgrounds/:id", validateData, catchAsync(async (req,res) => {
    const campground = await campgroundSchema.findByIdAndUpdate(req.params.id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete("/campgrounds/:id", catchAsync(async (req,res) => {
    await campgroundSchema.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
}));

app.all('*', (req,res,next) => {
    next(new ExpressError("Page not found", 404));
});

app.use((err,req,res,next) => {
    const {status = 500} = err;
    if(!err.message){
        err.message = "Something went wrong"
    }
    res.status(status).render("error", { err });
});

app.listen(3000, () => {
    console.log("Server started");
});