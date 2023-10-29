const Joi = require('joi')

module.exports = {
    User: Joi.object({
        name: Joi.string()
            .required()
            .min(3)
            .max(30),


        email: Joi.string()
            .email()
            .lowercase()
            .required(),

        password: Joi.string()
            .min(6)
            .required(),
    })
}