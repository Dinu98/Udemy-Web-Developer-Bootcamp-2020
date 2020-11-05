const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const validateSchemas = require('../validateSchemas');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');

const validateReview = (req,res,next) => {
    const validateReviewSchema = validateSchemas.reviewSchema;

    const { error } = validateReviewSchema.validate(req.body);

    if(error){
        console.log(error);
        const message = error.details.map(el => el.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

router.post("/", validateReview, catchAsync(async (req,res) =>{
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