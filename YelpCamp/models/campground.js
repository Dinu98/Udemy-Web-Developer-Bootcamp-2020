const mongoose = require('mongoose');
const Review = require('./review');

const { Schema } = mongoose;

const ImageSchema = new  Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload','/upload/w_200');
});

const campgroundSchema = new Schema({
    name: String,
    price: Number,
    description: String,
    location: String,
    geometry:{
        type:{
            type: String,
            enum: ["Point"],
            require: true,
        },
        coordinates:{
            type: [Number],
            require: true
        }
    },
    images: [ImageSchema],
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