const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/relationships', {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    console.log("Successfully connected");
})
.catch( err => {
    console.log("Error while trying to connect");
    console.log(err);
});

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    address: [
        {
        //_id: { id : false}, if you want every address to have it's own id 
        city: String,
        state: String,
        country: String
        }
    ]
});

const User = mongoose.model("User", userSchema);

const makeUser = async () => {
    await User.deleteMany({});
    const newUser = new User({
        name: "Harry",
        age: 31,
        email: "email",
        address: {
            city: "city",
            state: "state",
            country: "country"
        }
    });

    const savedUser = await newUser.save();
    console.log(savedUser);
};

makeUser();