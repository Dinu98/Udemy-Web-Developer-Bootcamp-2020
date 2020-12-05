const Joi = require('joi');

campgroundsSchema = Joi.object({
    campground: Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        // image: Joi.string().required(),
        price: Joi.number().min(0).required()

    }).required(),
    deleteImages: Joi.array()
});

reviewSchema = Joi.object({
    review: Joi.object({
        text: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required()
    }).required()
})


module.exports= {
    campgroundsSchema,
    reviewSchema
}