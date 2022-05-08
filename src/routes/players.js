

const {
    findPlayerById,
    listPlayers,
    insertPlayer,
    deletePlayerById,
    editPlayerById
} = require('../repository/players')
const { generatePasswordHash } = require('../helpers/auth')
const players = require('../repository/players')
module.exports = {
    // Req é a requisição HTTP recebida
    // Res é a response HTTP que vai ser enviada para o cliente
    me: async (req, res) => {

        const player = await findPlayerById(req.tokenPayload.id)
        res.status(200).send(player)
    },

    list: async (req, res) => {
        const playersList = await listPlayers()
        res.send(playersList)
    },

    create: async (req, res) => {
        const player = req.body
        player.password = generatePasswordHash(player.password)
        try {
            const newPlayer = await insertPlayer(req.body)
            res.status(201).send({ message: 'Player created', data: newPlayer })
        } catch {
            res.status(422).json({
                message: 'Email taken',
            })
        }

    },

    get: async (req, res) => {
        const player = await findPlayerById(Number(req.params.id))

        if (player) {
            res.send(player)
        }
        else {
            res.status(404).send({
                message: 'No player available using that ID',
            })
        }
    },

    delete: async (req, res) => {
        const playerDeleted = await deletePlayerById(Number(req.params.id))
        if (playerDeleted) {
            res.send({ message: 'Player deleted' })
        } else {
            res.status(404).send({
                message: 'No player available using that ID',
            })
        }
    },

    put: async (req, res) => {
        const playerId = Number(req.params.id)
        if (req.tokenPayload.id !== playerId) {
            res.status(401).send({ message: 'Cannot edit player that is not self' })
            return
        }
        if (req.body.password) {
            req.body.password = generatePasswordHash(req.body.password)
        }

        const playerEdited = await editPlayerById(playerId, req.body)
        if (playerEdited) {
            res.send({ message: 'Player edited' })
        }
        else {
            res.status(404).send({
                message: 'No player available using that ID',
            })
        }
    }
}