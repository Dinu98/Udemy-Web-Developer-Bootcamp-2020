const express = require('express');
const passport = require('passport');
const  middlewares  = require('../middlewares');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const userController = require('../controllers/user');

router.route("/register")
    .get(userController.registerForm)
    .post(catchAsync(userController.register))

router.route("/login")
    .get(userController.loginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect:"/login"}), userController.login)

router.get("/logout", middlewares.isLoggedIn, userController.logout);

module.exports = router;