const { Player } = require('../models/player')

module.exports = {
    validatePlayer: (player) => {
        const { value: validationPlayer, error } = Player.validate(player)

        if (error !== undefined) {
            return {
                valid: false,
                data: {
                    message: 'Invalid request',
                    data: player,
                    error: error && error.details
                }
            }
        } else {
            return {
                valid: true,
                data: validationPlayer
            }
        }
    }
}