const { Spell } = require('../models/spell')
const { SpellLevel } = require('../models/spellLevel')
const { SpellLevelPlayer } = require('../models/spellLevelPlayer')

module.exports = {
    findSpellLevelPlayerById: async (id) => {
        const spellLevelPlayer = await SpellLevelPlayer.findOne({ where: { id }, include: [{ model: SpellLevel, as: "spellLevel", include: ['spell'] }] })
        return spellLevelPlayer
    },

    findSpellLevelById: async (id) => {
        const spellLevel = await SpellLevel.findOne({ where: { id } })
        return spellLevel
    },

    findSpellById: async (id) => {
        const spell = await Spell.findOne({ where: { id } })
        return spell
    },

    listSpellLevelPlayers: async () => {
        const spellLevelPlayer = await SpellLevelPlayer.findAll()
        return spellLevelPlayer
    },

    listSpellLevels: async () => {
        const spellLevel = await SpellLevel.findAll()
        return spellLevel
    },

    listSpells: async () => {
        const spell = await Spell.findAll()
        return spell
    },

    editSpellLevelPlayerById: async (spellLevelPlayer, id) => {
        const updatedSpellLevelPlayer = await SpellLevelPlayer.update(spellLevelPlayer, { where: { id }, returning: true })

        return updatedSpellLevelPlayer
    },

    // ------ Debug ------

    insertSpellLevelPlayer: async (spellLevelPlayer) => {
        const newSpellLevelPlayer = await SpellLevelPlayer.create(spellLevelPlayer)
        return newSpellLevelPlayer
    },

    insertSpellLevel: async (spellLevel) => {
        const newSpellLevel = await SpellLevel.create(spellLevel)
        return newSpellLevel
    },

    insertSpell: async (spell) => {
        const newSpell = await Spell.create(spell)
        return newSpell
    },

    // -------------------

    setPlayerId: async (spellLevelPlayerId, playerId) => {
        const spellLevelPlayer = await SpellLevelPlayer.update({ playerId }, { where: { id: spellLevelPlayerId }, returning: true })
        return spellLevelPlayer
    }

}