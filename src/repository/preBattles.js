const { Battle } = require('../models/battle')
const { PreBattle } = require('../models/preBattle')
const { Player } = require('../models/player')
const { Monster } = require('../models/monster')

module.exports = {
    insertPreBattle: async (preBattle) => {
        const newPreBattle = await PreBattle.create({ ...preBattle })
        return newPreBattle
    },

    updatePreBattle: async (id, update) => {
        const updatedPreBattle = await PreBattle.update(update, { where: { id } })
        return updatedPreBattle
    },

    listPreBattles: async (id) => {
        const preBattles = await PreBattle.scope('withoutPlayerId').findAll({ include: [{ model: Player, as: 'player', attributes: ['name', 'class', 'email', 'id'] }, { model: Monster, as: 'monster' }] })
        return preBattles
    },

    findCurrentPreBattleByPlayer: async (playerId) => {
        const preBattle = await PreBattle.scope('withoutPlayerId').findOne({ where: { playerId, finished: false }, include: [{ model: Player.scope('withoutPassword'), as: 'player' }, { model: Monster, as: 'monster' }] })
        return preBattle
    },
}