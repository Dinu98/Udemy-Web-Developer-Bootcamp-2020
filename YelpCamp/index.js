const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const campgroundSchema = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});

mongoose.connection.on("error", console.error.bind(console, "Error while trying to connect to DB"));
mongoose.connection.once("open", () => {
    console.log("Successfully connected to DB");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.get("/", (req,res) => {
    res.send("It works");
});

app.listen(3000, () => {
    console.log("Server started");
});