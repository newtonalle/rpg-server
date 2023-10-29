const { Item } = require('../models/player')
const { Player } = require('../models/player')
const { SpellLevelPlayer } = require('../models/spellLevelPlayer')

const { generatePasswordHash } = require('../helpers/auth')

const { generatePlayerUserToken } = require('../helpers/auth')

const {
    findPlayerById,
    listPlayers,
    insertPlayer,
    deletePlayerById,
    editPlayerById
} = require('../repository/players')

const {
    findClassById,
    listClasses,
} = require('../repository/classes')

const {
    listBattles,
} = require('../repository/battles')


const {
    findUserById,
} = require('../repository/users')


const {
    toggleItemById
} = require('../repository/items')

const {
    editSpellLevelPlayerById
} = require('../repository/spells')

const BASE_PLAYER_STATS = {
    experience: 0,
    gold: 0,
    health: 100,
    mana: 200,
    unallocatedSpellLevels: 0,
}

module.exports = {
    // Req é a requisição HTTP recebida
    // Res é a response HTTP que vai ser enviada para o cliente
    me: async (req, res) => {

        const player = await findPlayerById(req.tokenPayload.playerId)
        res.status(200).send(player)
    },

    selectPlayer: async (req, res) => {

        const user = await findUserById(req.tokenPayload.id)
        if (!user) {
            return res.status(404).json({
                message: 'No user using that id',
            })
        }
        const player = await findPlayerById(req.params.id)
        if (!player) {
            return res.status(404).json({
                message: 'No player using that id',
            })
        }
        if (player.userId != user.id) {
            return res.status(403).json({
                message: 'Trying to select non-owned user',
            })
        }
        const token = generatePlayerUserToken(user, player)
        res.status(200).send({ token, player })


    },

    list: async (req, res) => {
        const playersList = await listPlayers(Number(req.params.userId))
        res.send(playersList)
    },

    create: async (req, res) => {
        const player = req.body
        console.log(player)
        if (Number(req.params.userId) === req.tokenPayload.id) {
            player.userId = Number(req.params.userId)
            const playerClass = await findClassById(Number(req.params.classId))

            if (playerClass) {
                player.experience = BASE_PLAYER_STATS.experience
                player.gold = BASE_PLAYER_STATS.gold

                player.attributeStrength = playerClass.baseStrength
                player.attributeDexterity = playerClass.baseDexterity
                player.attributeIntelligence = playerClass.baseIntelligence

                player.maxHealth = BASE_PLAYER_STATS.health
                player.currentHealth = BASE_PLAYER_STATS.health

                player.maxMana = BASE_PLAYER_STATS.mana
                player.currentMana = BASE_PLAYER_STATS.mana

                player.unallocatedSpellLevels = BASE_PLAYER_STATS.unallocatedSpellLevels

                player.classId = Number(req.params.classId)

                try {
                    const newPlayer = await insertPlayer(player)
                    res.status(201).send({ message: 'Player created', data: newPlayer })
                } catch (e) {
                    console.log(e)
                    res.status(500).send({ message: e })
                }
            } else {
                res.status(404).json({
                    message: 'No class using that id',
                })
            }
        } else {
            res.status(401).json({
                message: 'Cannot create player for user that is not self',
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
            console.log(e)
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
        if (req.tokenPayload.playerId !== playerId) {
            res.status(401).send({ message: 'Cannot edit player that is not self' })
            return
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

            const player = await Player.findOne({ where: { id: item.playerId }, include: ['items'] })

            if (!item.equipped) {

                // On Equip

                if (player.totalStrength >= item.requiredStrength && player.totalDexterity >= item.requiredDexterity && player.totalIntelligence >= item.requiredIntelligence) {
                    await toggleItemById(id)
                    res.send({ message: 'Item equipped status toggled' })
                } else {
                    res.status(400).send({
                        message: 'Item requirements not met',
                    })
                }
            } else {

                // On Unequip

                await toggleItemById(id)
                res.send({ message: 'Item equipped status toggled' })
            }
        }
    },

    toggleSpell: async (req, res) => {
        const id = (Number(req.params.id))
        const spellLevelPlayer = await SpellLevelPlayer.findOne({ where: { id } })

        if (spellLevelPlayer === null) {
            res.status(404).send({
                message: 'No "spellLevelPlayer" found using that ID',
            })
        } else {
            // const player = await Player.findOne({ where: { id: spellLevelPlayer.playerId }, include: ['spellLevelPlayers'] })

            await editSpellLevelPlayerById({ equipped: !spellLevelPlayer.equipped }, id)
            res.send({ message: '"spellLevelPlayer" equipped status toggled' })
        }
    },

    battleHistory: async (req, res) => {
        const battles = await listBattles(req.tokenPayload.playerId)
        res.send({ data: battles })
    },

    getPlayerClass: async (req, res) => {
        try {
            const player = await findPlayerById(Number(req.params.id))
            if (player) {
                const playerClass = await findClassById(player.classId)
                res.send(playerClass)
            }
            else {
                res.status(404).send({
                    message: 'No player available using that ID',
                })
            }
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e })
        }
    },

    addAtributtePoints: async (req, res) => {
        const player = await findPlayerById(Number(req.params.playerId))
        if (player) {
            if (req.tokenPayload.playerId !== player.id) {
                res.status(401).send({ message: 'Cannot edit player that is not self' })
                return
            } else {
                let attributeAdditions = req.body.attributes

                let attributePointsSpent = attributeAdditions.attributeStrength + attributeAdditions.attributeDexterity + attributeAdditions.attributeIntelligence

                if (attributePointsSpent > player.unallocatedAttributePoints) {
                    res.status(403).send({ message: "Player does not have enough ATP" })
                }

                attributeAdditions.attributeStrength += player.attributeStrength
                attributeAdditions.attributeDexterity += player.attributeDexterity
                attributeAdditions.attributeIntelligence += player.attributeIntelligence

                attributeAdditions = { ...attributeAdditions, unallocatedAttributePoints: (player.unallocatedAttributePoints - attributePointsSpent) }

                await editPlayerById(player.id, attributeAdditions)

                res.send({ message: 'Player edited' })
            }
        } else {
            res.status(404).send({
                message: 'No player available using that ID',
            })
        }
    }

}