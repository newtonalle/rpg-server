const Joi = require('joi')

module.exports = {
    Login: Joi.object({
        email: Joi.string()
            .email()
            .required(),

        password: Joi.string()
            .required()
    })
}