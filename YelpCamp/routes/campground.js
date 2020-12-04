const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require('../models/campground');
const middlewares  = require('../middlewares');
const campgroundController = require('../controllers/campground');

router.get("/", catchAsync(campgroundController.index));

router.get("/new", middlewares.isLoggedIn, campgroundController.new);

router.get("/:id", catchAsync(campgroundController.show));

router.get("/:id/edit", middlewares.isLoggedIn, middlewares.isAuthorCampground, catchAsync(campgroundController.edit));

router.post("/", middlewares.isLoggedIn, middlewares.validateCampground, catchAsync(campgroundController.create));

router.patch("/:id", middlewares.isLoggedIn, middlewares.isAuthorCampground, middlewares.validateCampground, catchAsync(campgroundController.patch));

router.delete("/:id", middlewares.isLoggedIn, middlewares.isAuthorCampground, catchAsync(campgroundController.delete));

module.exports = router;