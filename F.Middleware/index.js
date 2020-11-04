const express = require('express');
const app = express();
const morgan = require('morgan');

const verifyPassword = (req,res,next) =>{
    const { password } = req.query
    if(password === "Pass"){
        return next();
    } else {
        res.send("You need a password to access this route");
    }
}

app.use(morgan("dev"));

app.get("/", (req,res) => {
    res.send("It works");
});

app.get("/database", verifyPassword, (req,res) =>{
    res.send("You can now access our database");
});

app.listen(3000, () =>{
    console.log("Server started");
})