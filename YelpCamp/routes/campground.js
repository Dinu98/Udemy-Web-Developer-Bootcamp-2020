const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const validateSchemas = require('../validateSchemas');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');

const validateCampground = (req,res,next) => {
    const validateCampgroundsSchema = validateSchemas.campgroundsSchema;

    const { error } = validateCampgroundsSchema.validate(req.body);

    if(error){
        const message = error.details.map(el => el.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

router.get("/", catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

router.get("/new", (req,res) => {
    res.render("campgrounds/new");
});

router.get("/:id", catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    res.render("campgrounds/show", { campground });
}));

router.get("/:id/edit", catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
}));

router.post("/", validateCampground, catchAsync(async (req,res) => {
    await new Campground(req.body.campground).save().
        then( (newCampground) => {
            res.redirect(`/campgrounds/${newCampground._id}`);
        });
}));

router.patch("/:id", validateCampground, catchAsync(async (req,res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:id", catchAsync(async (req,res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
}));

module.exports = router;