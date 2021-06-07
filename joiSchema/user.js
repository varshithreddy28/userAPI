const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string()
        .required(),
    email: Joi.string()
        .email()
        .required(),
    mobileNumber: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
    hobies: Joi.array().items(Joi.string())
})

module.exports = userSchema