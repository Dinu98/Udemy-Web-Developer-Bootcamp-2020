const express = require('express');
const app = express();
const usersRouter = require('./routes/user');

app.use("/users", usersRouter);

app.listen(3000, () => {
    console.log("Server started");
});