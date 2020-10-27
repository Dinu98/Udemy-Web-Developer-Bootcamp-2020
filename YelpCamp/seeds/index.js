const mongoose = require('mongoose');
const campgroundSchema = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});

mongoose.connection.on("error", console.error.bind(console, "Error while trying to connect to DB"));
mongoose.connection.once("open", () => {
    console.log("Successfully connected to DB");
});

const randomName = arr => arr[Math.floor(Math.random() * arr.length)];

const randomLocation = async () => {
    await campgroundSchema.deleteMany({});

    for (let i = 0; i < 100; i++) {
        const randomNumber = Math.floor(Math.random() * 1000);
        await new campgroundSchema({
            location: `${cities[randomNumber].city}, ${cities[randomNumber].state}`,
            name: `${randomName(places)} ${randomName(descriptors)}`
        }).save();
    }
};

randomLocation().then( () => {
    mongoose.connection.close();
});