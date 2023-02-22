const { Item } = require('../models/player')
const { Player } = require('../models/player')

const { generatePasswordHash } = require('../helpers/auth')

const {
    findPlayerById,
    listPlayers,
    insertPlayer,
    deletePlayerById,
    editPlayerById
} = require('../repository/players')

const {
    toggleItemById
} = require('../repository/items')
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
        } catch (e) {
            res.status(422).json({
                message: 'Email taken',
            })
        }

    },

    get: async (req, res) => {
        try {
            const player = await findPlayerById(Number(req.params.id))
            if (player) {
                res.send(player)
            }
            else {
                res.status(404).send({
                    message: 'No player available using that ID',
                })
            }
        } catch (e) {
            res.status(500).send({ message: e })
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
    },

    listInventory: async (req, res) => {
        const player = await findPlayerById(req.params.id)
        res.send({ data: player.inventory })
    },

    toggleItem: async (req, res) => {
        const id = (Number(req.params.id))
        const item = await Item.findOne({ where: { id } })

        if (item === null) {
            res.status(404).send({
                message: 'No item found using that ID',
            })
        } else {

            const player = await Player.scope('withoutPassword').findOne({ where: { id: item.playerId }, include: ['items'] })

            if (!item.equipped) {

                // On Equip

                if (player.totalStrength >= item.requiredStrength && player.totalDexterity >= item.requiredDexterity && player.totalIntelligence >= item.requiredIntelligence) {
                    await toggleItemById(id)
                    res.send({ message: 'Item equipped status toggled' })
                } else {
                    res.status(400).send({
                        message: 'Total attribute insulficient',
                    })
                }
            } else {

                // On Unequip

                await toggleItemById(id)
                res.send({ message: 'Item equipped status toggled' })
            }
        }
    },

    listBattles: async (req, res) => {
        const player = await Player.findOne({ where: { id: req.params.id }, include: ['battles'] })
        res.send({ data: player.battles })
    },
}