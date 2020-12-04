const User = require('../models/user');

module.exports.registerForm = (req,res) => {
    res.render("users/new");
};

module.exports.register = async(req,res,next) => {
    try{
        const {username, password, email} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if(err){
                return next(err);
            }
            req.flash('success','Welcome to YelpCamp');
            res.redirect("/campgrounds");
        });
    } catch(e){
        req.flash('error', e.message);
        res.redirect("/register");
    }
};

module.exports.loginForm = (req,res) => {
    res.render("users/login");
};

module.exports.login = (req,res) => {
    req.flash('success', 'welcome back');
    const returnTo = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(returnTo);
};

module.exports.logout = (req,res) => {
    req.logout();
    req.flash('success', 'successfully logged out');
    res.redirect("/campgrounds");
};