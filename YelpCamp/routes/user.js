const express = require('express');
const passport = require('passport');
const user = require('../models/user');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');


router.get("/register", (req,res) => {
    res.render("users/new");
});

router.post("/register", catchAsync(async(req,res) => {
    try{
        const {username, password, email} = req.body;
        const newUser = new user({username, email});
        const registeredUser = await user.register(newUser, password);
        req.flash('success','Welcome to YelpCamp');
        res.redirect("/campgrounds");
    } catch(e){
        req.flash('error', e.message);
        res.redirect("/register");
    }
}));

router.get("/login", (req,res) => {
    res.render("users/login");
});

router.post("/login", passport.authenticate('local', {failureFlash: true, failureRedirect:"/login"}), (req,res) => {
    req.flash('success', 'welcome back');
    res.redirect("/campgrounds");
});

module.exports = router;