const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const Review = require('../models/review');
const Campground = require('../models/campground');
const {review} = require('../middlewares');

router.post("/", review.validateReview, catchAsync(async (req,res) =>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully created a new review");
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:reviewID", catchAsync(async (req,res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID }});
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Successfully deleted a review");
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;