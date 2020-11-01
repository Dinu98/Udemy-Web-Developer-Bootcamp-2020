const Joi = require('joi');

campgroundsSchema = Joi.object({
    campground: Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required(),
        price: Joi.number().min(0).required()

    }).required()
});


module.exports.schemas = {
    campgroundsSchema
}