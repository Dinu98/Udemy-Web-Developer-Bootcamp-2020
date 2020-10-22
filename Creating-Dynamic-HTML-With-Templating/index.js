const express = require('express');
const app = express();
const path = require("path");
const data = require("./data.json")

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"/views"));

app.get("/", (req,res) => {
    res.render("home");
});

app.get("/random", (req,res) => {
    const random = Math.floor(Math.random() * 10) + 1;
    res.render("random", {random} ) // or { inside template name : variable}
})

app.get("/topics/:topic", (req,res) => {
    const { topic } = req.params;
    const topicData = data[topic];

    console.log(topicData);

    if(topicData) {
        res.render("topic", {...topicData} )
    } else {
        res.render("empty", { topic })
    }
})

app.listen(3000, () => {
    console.log("Server started");
})