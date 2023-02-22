const { Monster } = require('../models/monster')

module.exports = {
    insertMonsters: async (monsters) => {
        console.log(monsters)
        const newMonster = await Monster.bulkCreate(monsters)
        return newMonster
    },

    assignMonsterToBattle: async (monsterId, battleId) => {
        const monster = await Monster.update({ battleId }, { where: { id: monsterId }, returning: true })
        return monster
    },

    findMonsterById: async (id) => {
        const monster = await Monster.findOne({ where: { id } })
        return monster
    },

    listMonsters: async () => {
        const monsters = await Monster.findAll()
        return monsters
    },
}