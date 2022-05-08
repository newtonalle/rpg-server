const Joi = require('joi')

module.exports = {
    Player: Joi.object({
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

        class: Joi.string()
            .valid("mage", "warrior", "archer")
            .required(),

        attributes: Joi.object({

            strength: Joi.number()
                .required(),

            dexterity: Joi.number()
                .required(),

            intelligence: Joi.number()
                .required()

        }).required()
    })
}