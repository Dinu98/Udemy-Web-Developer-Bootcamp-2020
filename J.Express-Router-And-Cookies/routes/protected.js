const express = require('express');
const router = express.Router();

router.use((req,res,next) => {
    if(req.query.pass){
        return next();
    } 
    res.send("You don't have the password");
});

router.get("/secret", (req,res) => {
    res.send("Secret document");
});

module.exports = router;