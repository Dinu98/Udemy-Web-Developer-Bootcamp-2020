const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const middlewares = require('../middlewares');
const reviewController = require('../controllers/review');

router.post("/", middlewares.validateReview, catchAsync(reviewController.create));

router.delete("/:reviewID", middlewares.isAuthorReview, catchAsync(reviewController.delete));

module.exports = router;