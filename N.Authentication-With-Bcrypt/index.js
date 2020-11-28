const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { urlencoded } = require('express');
const User = require("./models/user");

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

app.get("/", (req,res) => {
    res.send("HOME PAGE");
});

app.get("/register", (req,res) => {
    res.render("register");
});

app.post("/register", async (req,res) =>{
    const {username, password} = req.body;
    const hash = await bcrypt.hash(password,12);
    const user = new User({
        username,
        password : hash
    });
    await user.save();
    res.redirect("/");
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
