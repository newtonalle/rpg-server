const { Round } = require('../models/round')

module.exports = {
    insertRound: async (round) => {
        const newRound = await Round.create(round)
        return newRound
    },

    listRounds: async (battleId) => {
        const rounds = await Round.findAll({ where: { battleId } })
        return rounds
    },
}