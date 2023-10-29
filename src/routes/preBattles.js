const {
    assignMonstersToPreBattle,
} = require('../repository/monsters')

const {
    insertPreBattle,
    listPreBattles,
    findCurrentPreBattleByPlayer
} = require('../repository/preBattles')

module.exports = {
    create: async (req, res) => {
        const preBattle = await insertPreBattle({ playerId: req.tokenPayload.playerId })
        await assignMonstersToPreBattle(req.body.monsterIds, preBattle.id)
        res.status(201).send({ message: 'Pre Battle created', data: preBattle })
    },

    getCurrentPreBattle: async (req, res) => {
        const preBattle = await findCurrentPreBattleByPlayer(Number(req.tokenPayload.playerId))

        if (preBattle) {
            res.send(preBattle)
        }
        else {
            res.status(404).send({
                message: 'This player is not currently in a pre battle',
            })
        }
    },

    list: async (req, res) => {
        const preBattlesList = await listPreBattles()
        res.send(preBattlesList)
    },
}