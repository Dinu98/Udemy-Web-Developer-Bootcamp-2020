const express = require('express');
const app = express();
const path = require('path');
const { Z_DATA_ERROR } = require('zlib');

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));

const comments = [
    {
        name : "user1",
        comment : "comment1"
    },
    {
        name : "user2",
        comment : "comment2"
    },
    {
        name : "user3",
        comment : "comment3"
    }
]

app.get("/comments", (req,res) => {
    res.render("comments/index",{ comments });
});

app.listen(3000,() => {
    console.log("Server started");
});