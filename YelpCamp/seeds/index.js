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

    for (let i = 0; i < 1000; i++) {
        const randomNumber = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 50);
        await new campgroundSchema({
            user: "5fc953486e053d02a9f7bbbd",
            location: `${cities[randomNumber].city}, ${cities[randomNumber].state}`,
            name: `${randomName(places)} ${randomName(descriptors)}`,
            price,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis temporibus quam iure quis fuga, velit tenetur eligendi asperiores repellat cumque rerum iste error aperiam pariatur blanditiis vero, suscipit cupiditate cum!",
            geometry: { coordinates: [ cities[randomNumber].longitude, cities[randomNumber].latitude ], type: 'Point' },
            images:[ 
                {
                url:
                 'https://res.cloudinary.com/deqyehnld/image/upload/v1607205868/YelpCamp/hk7asy6qyghqmttloylu.jpg',
                filename: 'YelpCamp/hk7asy6qyghqmttloylu' 
                },
                {
                url:
                 'https://res.cloudinary.com/deqyehnld/image/upload/v1607205868/YelpCamp/bhfomkev6df9rvcebty6.jpg',
                filename: 'YelpCamp/bhfomkev6df9rvcebty6' 
                } 
            ]

        }).save();
    }
};

randomLocation().then( () => {
    mongoose.connection.close();
});