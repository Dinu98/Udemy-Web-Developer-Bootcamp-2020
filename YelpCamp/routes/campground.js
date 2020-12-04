const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require('../models/campground');
const middlewares  = require('../middlewares');
const campgroundController = require('../controllers/campground');

router.route("/")
    .get(catchAsync(campgroundController.index))
    .post(middlewares.isLoggedIn, middlewares.validateCampground, catchAsync(campgroundController.create))

router.get("/new", middlewares.isLoggedIn, campgroundController.new);

router.route("/:id")
    .get(catchAsync(campgroundController.show))
    .patch(middlewares.isLoggedIn, middlewares.isAuthorCampground, middlewares.validateCampground, catchAsync(campgroundController.patch))
    .delete(middlewares.isLoggedIn, middlewares.isAuthorCampground, catchAsync(campgroundController.delete))

router.get("/:id/edit", middlewares.isLoggedIn, middlewares.isAuthorCampground, catchAsync(campgroundController.edit));

module.exports = router;