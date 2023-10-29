const { Player } = require('../models/player')
const { Class } = require('../models/class')
const { SpellLevelPlayer } = require('../models/spellLevelPlayer')
const { SpellLevel } = require('../models/spellLevel')

module.exports = {
    findPlayerById: async (id) => {
        const player = await Player.scope('fullPlayer').findOne({ where: { id }, include: [{ model: SpellLevelPlayer, as: "spellLevelPlayers", include: [{ model: SpellLevel, as: "spellLevel", include: ['spell'] }] }] })
        return player
    },
    insertPlayer: async (player) => {
        const newPlayer = await Player.create(player)
        return newPlayer
    },
    listPlayers: async (userId) => {
        const players = await Player.scope('fullPlayer').findAll({ where: { userId } })
        return players
    },
    deletePlayerById: async (id) => {
        const count = await Player.destroy({ where: { id } })
        return count > 0
    },
    editPlayerById: async (id, bodyPlayer) => {
        const [count] = await Player.update(bodyPlayer, { where: { id }, returning: true })
        return count > 0
    },
}