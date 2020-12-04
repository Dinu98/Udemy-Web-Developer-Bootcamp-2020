const express = require('express');
const passport = require('passport');
const  middlewares  = require('../middlewares');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const userController = require('../controllers/user');


router.get("/register", userController.registerForm);

router.post("/register", catchAsync(userController.register));

router.get("/login", userController.loginForm);

router.post("/login", passport.authenticate('local', {failureFlash: true, failureRedirect:"/login"}), userController.login);

router.get("/logout", middlewares.isLoggedIn, userController.logout);

module.exports = router;