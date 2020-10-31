const express = require('express');
const app = express();
const morgan = require('morgan');

const verifyPassword = (req,res,next) =>{
    const { password } = req.query
    if(password === "Pass"){
        return next();
    } else {
        throw new Error("You need a password to access this route")
    }
}

app.use(morgan("dev"));

app.get("/", (req,res) => {
    res.send("It works");
});

app.get("/database", verifyPassword, (req,res) =>{
    res.send("You can now access our database");
});

app.use((err,req,res,next) => {
    console.log(err);
    next(err);
});

app.listen(3000, () =>{
    console.log("Server started");
})