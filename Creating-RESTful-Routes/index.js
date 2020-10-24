const express = require('express');
const app = express();
const path = require('path');
const {v4 : getID} = require('uuid');
const methodOverride = require('method-override');


app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

let comments = [
    {
        id : getID(),
        name : "user1",
        comment : "comment1"
    },
    {
        id : getID(),
        name : "user2",
        comment : "comment2"
    },
    {
        id : getID(),
        name : "user3",
        comment : "comment3"
    }
]

app.get("/comments", (req,res) => {
    res.render("comments/index",{ comments });
});

app.get("/comments/new", (req,res) => {
    res.render("comments/new");
});

app.post("/comments", (req,res) => {
    const {name, comment} = req.body;
    comments.push({name, comment, id : getID()});
    res.redirect("/comments");
});

app.get("/comments/:id", (req,res) => {
    const {id} = req.params;
    const comment = comments.find( (comment) => comment.id === id);
    res.render("comments/show", {comment});
});

app.patch("/comments/:id", (req,res) => {
    const {id} = req.params;
    const {updatedComment} = req.body
    const foundComment = comments.find( comment => comment.id === id);
    foundComment.comment = updatedComment;
    res.redirect("/comments");
});

app.get("/comments/:id/edit", (req,res) => {
    const {id} = req.params;
    const comment = comments.find( (comment) => comment.id === id);
    res.render("comments/edit",{comment});
});

app.delete("/comments/:id", (req,res) => {
    const {id} = req.params;
    comments = comments.filter( comment => comment.id !== id);
    res.redirect("/comments");
});

app.listen(3000,() => {
    console.log("Server started");
});