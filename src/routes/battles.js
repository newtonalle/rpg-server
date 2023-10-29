const {
    assignMonsterToBattle,
    findMonsterById,
} = require('../repository/monsters')

const {
    findPlayerById,
} = require('../repository/players')

const {
    findCurrentPreBattleByPlayer,
    updatePreBattle,
} = require('../repository/preBattles')

const {
    insertBattle,
    findFullBattleById,
    listBattles,
    findCurrentBattleByPlayer,
} = require('../repository/battles')
module.exports = {
    create: async (req, res) => {
        const monster = await findMonsterById(req.body.monsterId)

        if (monster === null) {
            res.status(404).send({
                message: 'No monster found using that ID',
            })
        } else {
            if (monster.battleId != null) {
                res.status(409).send({
                    message: 'This monster is already in another battle',
                })
            } else {
                const preBattle = await findCurrentPreBattleByPlayer(Number(req.tokenPayload.playerId))

                if (!preBattle) {
                    res.status(404).send({
                        message: 'Trying to create battle without associated pre-battle',
                    })
                } else {
                    await updatePreBattle(preBattle.id, { ...preBattle, finished: true })
                    const battle = await insertBattle({ playerId: req.tokenPayload.playerId })
                    await assignMonsterToBattle(req.body.monsterId, battle.id)
                    res.status(201).send({ message: 'Battle created', data: battle })
                }
            }
        }
    },


    getCurrentBattle: async (req, res) => {
        const player = await findPlayerById(Number(req.tokenPayload.playerId))
        const battle = await findCurrentBattleByPlayer(player)

        if (battle) {
            res.send(battle)
        }
        else {
            res.status(404).send({
                message: 'This player is not currently in a battle',
            })
        }
    },

    get: async (req, res) => {

        try {
            const battle = await findFullBattleById(Number(req.params.battleId))
            if (battle) {
                res.send(battle)
            }
            else {
                res.status(404).send({
                    message: 'No battle available using that ID',
                })
            }
        } catch (e) {
            res.status(500).send({ message: e })
        }
    },

    list: async (req, res) => {
        const battlesList = await listBattles(Number(req.params.id))
        res.send(battlesList)
    },
}