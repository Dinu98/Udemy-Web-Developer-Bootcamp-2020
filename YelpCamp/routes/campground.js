const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require('../models/campground');
const {campground, user} = require('../middlewares');


router.get("/", catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

router.get("/new", user.isLoggedIn, (req,res) => {
    res.render("campgrounds/new");
});

router.get("/:id", catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    .populate({
        path: "reviews",
        populate: {
            path: "user"
        }
    })
    .populate("user");

    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
}));

router.get("/:id/edit", user.isLoggedIn, campground.isAuthorCampground, catchAsync(async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
}));

router.post("/", user.isLoggedIn, campground.validateCampground, catchAsync(async (req,res) => {
    req.body.campground.user = req.user._id;
    await new Campground(req.body.campground).save().
        then( (newCampground) => {
            req.flash("success", "Successfully created a new campground");
            res.redirect(`/campgrounds/${newCampground._id}`);
        });
}));

router.patch("/:id", user.isLoggedIn, campground.isAuthorCampground, campground.validateCampground, catchAsync(async (req,res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    req.flash("success", "Successfully updated a campground");
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:id", user.isLoggedIn, campground.isAuthorCampground, catchAsync(async (req,res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted a campground");
    res.redirect("/campgrounds");
}));

module.exports = router;