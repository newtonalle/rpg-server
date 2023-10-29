const Joi = require('joi')

module.exports = {
    Player: Joi.object({
        name: Joi.string()
            .required()
            .min(3)
            .max(30),

        /* experience: Joi.number()
             .required(),
 
         attributeStrength: Joi.number()
             .required(),
 
         attributeDexterity: Joi.number()
             .required(),
 
         attributeIntelligence: Joi.number()
             .required(),
 
         maxHealth: Joi.number()
             .required(),
 
         currentHealth: Joi.number()
             .required(),
 
         maxMana: Joi.number()
             .required(),
 
         currentMana: Joi.number()
             .required(), */
    })
}