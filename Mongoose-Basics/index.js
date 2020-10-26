const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/movies', {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    console.log("Successfully connected");
})
.catch( err => {
    console.log("Error while trying to connect");
    console.log(err);
});

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 20
    },
    year: {
        type: Number,
        required: true,
        min: [1888, "There was no movie created before this year"]
    },
    score: {
        type: Number,
        default: 8.0,
        min: 0.0
    },
    rating: {
        type: String,
        required: true
    },
    genres: [String],
    qty:{
        online:{
            type: Number,
            default: 0
        },
        inStore:{
            type: Number,
            default: 0
        }
    },
    recommendedForChildren:{
        type: String,
        enum: ["Yes","No"]
    }
});

movieSchema.methods.hello = function () {
    console.log(`Hello from ${this.title}`);
}

movieSchema.statics.bestScore = function () {
    return this.updateMany({},{score: 10});
}

movieSchema.virtual("titleYear").get(function () {
    return this.title + " " + this.year;
})

movieSchema.post("save",function (){
    console.log(`Just saved this movie:${this.title}`);
});

const Movie = new mongoose.model("Movie",movieSchema);

const find = async () => {
    const found = await Movie.findOne({title: "Movie"});
    found.hello();
    console.log(found.titleYear);
}

const updateScore = async () => {
    const update = await Movie.bestScore();
    console.log("Updated all movies");
    console.log(update);
}

find();
updateScore();

const someMovie = new Movie({title: "Movie", year: 1960, rating: "R",genres: ["Horror", "Action"]})
someMovie.save().
then( (data) => {
    console.log(data);
}).
catch( (err) => {
    console.log(err);
});


// Movie.findOneAndUpdate({title: "Movie"},{year: 1900},{new: true, runValidators: true}).
// then( (data) => {
//     console.log(data);
// }).
// catch( (err) => {
//     console.log(err);
// });


// Movie.insertMany([
//     {title: "movie1", year: 1, score: 1, rating: "rating1"},
//     {title: "movie2", year: 2, score: 2, rating: "rating2"},
//     {title: "movie3", year: 3, score: 3, rating: "rating3"}
// ]);
