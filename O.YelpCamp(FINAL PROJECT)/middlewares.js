const ExpressError = require('./utils/ExpressError');
const validateSchemas = require('./validateSchemas');
const Campground = require('./models/campground');
const Review = require('./models/review')

const isAuthorCampground = async (req,res,next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if(!campground.user.equals(req.user._id)){
        req.flash("error","You don't have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

const isAuthorReview = async (req,res,next) => {
    const { reviewID, id } = req.params;
    const review = await Review.findById(reviewID)
    if(!review.user.equals(req.user._id)){
        req.flash("error","You don't have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

const isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must login first');
        return res.redirect('/login');
    }
    next();
};

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

module.exports = {
    isAuthorCampground,
    validateCampground,
    validateReview,
    isAuthorReview,
    isLoggedIn
};