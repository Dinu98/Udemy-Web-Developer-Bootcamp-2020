const express = require('express');
const app = express();
const morgan = require('morgan');
const customError = require('./CustomError');

const verifyPassword = (req,res,next) =>{
    const { password } = req.query
    if(password === "Pass"){
        return next();
    } else {
        throw new customError(401,"You need a password to access this route");
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
    const { status = 500, message = "Something went wrong"} = err;
    res.status(status).send(message);
});

app.listen(3000, () =>{
    console.log("Server started");
})