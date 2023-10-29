const { Battle } = require('../models/battle')
const { PreBattle } = require('../models/preBattle')
const { Round } = require('../models/round')
const { Player } = require('../models/player')
const { Monster } = require('../models/monster')

module.exports = {
    insertBattle: async (battle) => {
        const newBattle = await Battle.create({ ...battle, isPlayerRound: true })
        return newBattle
    },

    findBattleById: async (id) => {
        const battle = await Battle.scope('withoutPlayerId').findOne({ where: { id }, include: { model: Player, as: 'player', attributes: ['name', 'classId', 'id'] } })
        return battle
    },

    findCurrentBattleByPlayer: async (player) => {
        const battle = await Battle.scope('withoutPlayerId').findOne({ where: { playerId: player.id, finished: false }, include: [{ model: Player, as: 'player', include: ['items'] }, { model: Monster, as: 'monster' }, { model: Round, as: 'rounds' }] })
        return battle
    },

    findFullBattleById: async (id) => {
        const battle = await Battle.findOne({ where: { id }, include: [{ model: Player, as: 'player', include: ['items', 'class'] }, { model: Monster, as: 'monster' }, { model: Round, as: 'rounds' }] })
        return battle
    },

    listBattles: async (playerId) => {
        const battles = await Battle.scope('withoutPlayerId').findAll({ where: { playerId }, include: [{ model: Player, as: 'player', attributes: ['name', 'classId', 'id'] }, { model: Monster, as: 'monster' }] })
        return battles
    },

    toggleIsPlayerRoundOnBattleById: async (id, isPlayerRound) => {
        const [count] = await Battle.update({ isPlayerRound: !isPlayerRound }, { where: { id }, returning: true })
        return count > 0
    }
}