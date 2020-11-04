const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser("secret"));

app.get("/product", (req,res) => {
    const { product = "something"} = req.cookies;
    res.send(`Your product is ${product}`);
});

app.get("/signedproduct", (req,res) => {
    const { signedproduct } = req.signedCookies;
    if(signedproduct){
        res.send(`Your signed product is ${signedproduct}`);
    } else {
        res.send("This cookie has lost it's integrity")
    }
});

app.get("/cookie", (req,res) => {
    res.cookie("product", "apple");
    res.send("Sent a cookie");
});

app.get("/signedcookie", (req,res) => {
    res.cookie("signedproduct", "pear",{signed: true});
    res.send("Sent a signed cookie");
});

app.listen(3000, () => {
    console.log("Server started");
});