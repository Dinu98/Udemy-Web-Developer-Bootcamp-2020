const mongoose = require('mongoose');
const Review = require('./review');

const { Schema } = mongoose;

const campgroundSchema = new Schema({
    name: String,
    price: Number,
    description: String,
    location: String,
    images: [
        {
        url: String,
        filename: String
        }
    ],
    user:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

campgroundSchema.post("findOneAndDelete", async function(data) {
    if(data){
        await Review.deleteMany({
            _id: {
                $in: data.reviews
            }
        })
    }
});

module.exports = mongoose.model("Campground", campgroundSchema);