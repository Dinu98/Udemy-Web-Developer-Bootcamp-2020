const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { urlencoded } = require('express');
const User = require("./models/user");
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/AuthApp', {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    console.log("Successfully connected to database");
})
.catch( err => {
    console.log("Error while trying to connect to database");
    console.log(err);
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({extended: true}));
app.use(session({secret: "secret"}));

const verifyLogin = (req,res,next) => {
    if(!req.session.userId){
        return res.redirect("/login");
    }
    next();
};  

app.get("/", (req,res) => {
    res.send("HOME PAGE");
});

app.get("/register", (req,res) => {
    res.render("register");
});

app.get("/login", (req,res) => {
    res.render("login");
});

app.post("/login", async (req,res) => {
    const {username , password} = req.body;
    const user  = await User.findOne({username});
    const result = await bcrypt.compare(password,user.password);
    if(result){
        req.session.userId = user._id;
        res.redirect("/secret");
    } else {
        res.redirect("/login");
    }
});

app.post("/register", async (req,res) =>{
    const {username, password} = req.body;
    const hash = await bcrypt.hash(password,12);
    const user = new User({
        username,
        password : hash
    });
    await user.save();
    req.session.userId = user._id;
    res.redirect("/secret");
});

app.post("/logout", (req,res) => {
    req.session.userId = null;
    res.redirect("/login");
});

app.get("/secret",verifyLogin, (req,res) => {
    if(!req.session.userId) {
        res.redirect("/login");
    }
    res.render("secret");
});


const hashPass = async (pass) =>{
    const hash = await bcrypt.hash(pass, 12);
    console.log(hash);
};

const verifyPass = async (pass) => {
    const result = await bcrypt.compare(pass,"$2b$12$biT1RFf9Avd5CRyyWUdLYubR.6tfeAzwg8lNxLafwh0z8R1QCKmCa");
    if(result){
        console.log("Successfully logged in");
    } else {
        console.log("Incorrect password");
    }
};

hashPass("123456");
verifyPass("1234566");


app.listen(3000, () => {
    console.log("Server started");
});
