const { Player } = require('../models/player')
const { SpellLevelPlayer } = require('../models/spellLevelPlayer')
const { SpellLevel } = require('../models/spellLevel')

module.exports = {
    findPlayerById: async (id) => {
        const player = await Player.scope('withoutPassword').findOne({ where: { id }, include: ['items', { model: SpellLevelPlayer, as: "spellLevelPlayers", include: [{ model: SpellLevel, as: "spellLevel", include: ['spell'] }] }] })
        return player
    },
    insertPlayer: async (player) => {
        const newPlayer = await Player.scope('withoutPassword').create(player)
        return newPlayer
    },
    listPlayers: async () => {
        const players = await Player.scope('withoutPassword').findAll()
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
    findPlayerByEmail: async (email) => {
        const player = await Player.findOne({ where: { email } })
        return player
    }
}