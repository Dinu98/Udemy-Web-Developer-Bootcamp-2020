const express = require('express');
const app = express();
const usersRouter = require('./routes/user');
const protectedRouter = require('./routes/protected');

app.use("/users", usersRouter);
app.use("/protected", protectedRouter);

app.listen(3000, () => {
    console.log("Server started");
});