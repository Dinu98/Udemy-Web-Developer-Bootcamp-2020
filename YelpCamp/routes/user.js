const express = require('express');
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
        console.log(registeredUser);
        req.flash('success','Welcome to YelpCamp');
        res.redirect("/campgrounds");
    } catch(e){
        req.flash('error', e.message);
        res.redirect("/register");
    }
}));

module.exports = router;