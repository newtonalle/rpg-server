const { handlePlayerAction, handleMonsterAction } = require('../services/rounds')

const { findBattleById, findFullBattleById, toggleIsPlayerRoundOnBattleById } = require('../repository/battles')

const {
    listRounds,
} = require('../repository/rounds')

const ROUNDS_PER_TURN_AMOUNT = 2 // Must be odd, otherwise the player will not be able to play (Recomended 2)

module.exports = {
    create: async (req, res) => {
        try {
            const response = []

            for (let i = 0; i < ROUNDS_PER_TURN_AMOUNT; i++) {
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
                    if (battle.isPlayerRound) {
                        response.push(await handlePlayerAction(req.body, battle))
                    } else {
                        response.push(await handleMonsterAction(req.body, battle))
                    }

                    await toggleIsPlayerRoundOnBattleById(battle.id, battle.isPlayerRound)
                }
            }

            res.status(201).send({ message: 'Round created', data: response })
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