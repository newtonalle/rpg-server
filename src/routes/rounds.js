const { handlePlayerAction, handleMonsterAction } = require('../services/rounds')

const { findBattleById, findFullBattleById, toggleIsPlayerRoundOnBattleById } = require('../repository/battles')

const {
    listRounds,
} = require('../repository/rounds')
module.exports = {
    create: async (req, res) => {
        try {
            const battle = await findFullBattleById(req.params.battleId)

            if (!battle) {
                res.status(404).send({ message: 'No battle found using that id' })
            } else if (battle.finished) {
                res.status(409).send({ message: 'Referenced battle has already ended' })
            } else if (!battle.player) {
                res.status(401).send({ message: 'Battle missing valid player' })
            } else if (!battle.monster) {
                res.status(401).send({ message: 'Battle missing valid monster' })
            } else {
                let response
                if (battle.isPlayerRound) {
                    response = await handlePlayerAction(req.body, battle)
                } else {
                    response = await handleMonsterAction(req.body, battle)
                }

                await toggleIsPlayerRoundOnBattleById(battle.id, battle.isPlayerRound)
                res.status(201).send({ message: 'Round created', data: response })
            }
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e.message })
        }
    },

    list: async (req, res) => {
        const roundsList = await listRounds(req.params.battleId)
        res.send(roundsList)
    },
}