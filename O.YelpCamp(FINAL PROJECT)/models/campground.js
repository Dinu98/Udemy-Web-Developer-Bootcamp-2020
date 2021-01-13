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

const config = {toJSON: {virtuals: true}};

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
},config);

campgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<a href=/campgrounds/${this._id}>${this.name}</a>
            <p>${this.description.substring(0,20)}</p>`
});


campgroundSchema.post("findOneAndDelete", async function(data) {
    if(data){
        await Review.deleteMany({
            _id: {
                $in: data.reviews
            }
        })
        for(let img of data.images){
            await cloudinary.uploader.destroy(img.filename);
        }
    }
});

module.exports = mongoose.model("Campground", campgroundSchema);