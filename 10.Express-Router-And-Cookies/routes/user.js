const express = require('express');
const router = express.Router();

router.get("/", (req,res) => {
    res.send("Index route for users");
});

router.post("/", (req,res) => {
    res.send("Create route for users");
});

router.get("/:id", (req,res) => {
    res.send("Show route for an user");
});

router.get("/:id/edit", (req,res) => {
    res.send("Edit route for an user");
});

module.exports = router;