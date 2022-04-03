const Joi = require('joi')

module.exports = {
    Player: Joi.object({
        name: Joi.string()
            .required()
            .min(3)
            .max(30)
    })
}