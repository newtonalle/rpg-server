const {
    findSpellLevelPlayerById,
    findSpellLevelById,
    findSpellById,
    editSpellLevelPlayerById,
    listSpellLevelPlayers,
    listSpellLevels,
    listSpells,
    setPlayerId,
    insertSpellLevelPlayer,
    insertSpellLevel,
    insertSpell
} = require('../repository/spells')

const {
    findPlayerById,
    editPlayerById,
} = require('../repository/players')
module.exports = {
    getSpellLevelPlayerById: async (req, res) => {
        const spellLevelPlayer = await findSpellLevelPlayerById(Number(req.params.id))

        if (spellLevelPlayer) {
            res.send(spellLevelPlayer)
        }
        else {
            res.status(404).send({
                message: 'No "spellLevelPlayer" available using that ID',
            })
        }

    },

    getSpellLevelById: async (req, res) => {
        const spellLevel = await findSpellLevelById(Number(req.params.id))

        if (spellLevel) {
            res.send(spellLevel)
        }
        else {
            res.status(404).send({
                message: 'No "spellLevel" available using that ID',
            })
        }

    },

    getSpellById: async (req, res) => {
        const spell = await findSpellById(Number(req.params.id))

        if (spell) {
            res.send(spell)
        }
        else {
            res.status(404).send({
                message: 'No "spell" available using that ID',
            })
        }

    },


    listSpells: async (req, res) => {
        const spellsList = await listSpells()
        res.send(spellsList)
    },

    listSpellLevels: async (req, res) => {
        const spellLevelsList = await listSpellLevels()
        res.send(spellLevelsList)
    },

    listSpellLevelPlayers: async (req, res) => {
        const spellLevelPlayersList = await listSpellLevelPlayers()
        res.send(spellLevelPlayersList)
    },


    addSpellToPlayer: async (req, res) => {
        const spellLevelPlayer = await setPlayerId(req.params.spellLevelPlayerId, req.params.playerId)
        res.status(201).send({ message: '"spellLevelPlayer" attributed to player', data: spellLevelPlayer })
    },

    levelUpSpell: async (req, res) => {
        const player = await findPlayerById(Number(req.params.playerId))
        const spellLevelPlayer = await findSpellLevelPlayerById(Number(req.params.spellLevelPlayerId))

        if (!player) {
            res.status(404).send({ message: 'No player found using this ID', data: spellLevelPlayer })
        }

        if (!spellLevelPlayer) {
            res.status(404).send({ message: 'No "spellLevelPlayer" found using this ID', data: spellLevelPlayer })
        }
        // Dúvida I
        if (player.unallocatedSpellLevels > 0) {
            console.log("Leveled up")
            // Base para os level ups
            const newSpellLevel = {
                spellId: spellLevelPlayer.spellLevel.spellId,
                level: (Number(spellLevelPlayer.spellLevel.level) + 1),
                manaCost: (Number(spellLevelPlayer.spellLevel.manaCost) + 10),
                damage: (Number(spellLevelPlayer.spellLevel.damage) + 10)
            }
            const createdSpellLevel = await insertSpellLevel(newSpellLevel)
            await editSpellLevelPlayerById({ spellLevelId: createdSpellLevel.id }, spellLevelPlayer.id)
            await editPlayerById(player.id, { unallocatedSpellLevels: (player.unallocatedSpellLevels - 1) })
            res.status(201).send({ message: 'Spell leveled up', data: spellLevelPlayer })
        } else {
            console.log("Failed to level up")
            res.status(400).send({ message: 'Spell leveling requirements not met', data: spellLevelPlayer })
        }
    },

    // ------ Debug -------

    addSpellLevelPlayer: async (req, res) => {
        const spellLevelPlayer = await insertSpellLevelPlayer(req.body)
        res.status(201).send({ message: '"spellLevelPlayer" created', data: spellLevelPlayer })
    },

    addSpellLevel: async (req, res) => {
        const spellLevel = await insertSpellLevel(req.body)
        res.status(201).send({ message: '"spellLevel" created', data: spellLevel })
    },

    addSpell: async (req, res) => {
        const spell = await insertSpell(req.body)
        res.status(201).send({ message: '"spell" created', data: spell })
    },


    // --------------------
}