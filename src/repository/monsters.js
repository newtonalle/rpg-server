const { Monster } = require('../models/monster')
const { Player } = require('../models/player')

const DEFAULT_MONSTER_NAMES = ['Revirlo', 'Fresckins', 'Alapart', 'Portyu', 'Refgik', 'Kerfto']
const DEFAULT_MONSTER_TYPES = ['Skeleton', 'Zombie', 'Ghost', 'Spider', 'Verm', 'Rat']
const DEFAULT_MONSTER_ATTRIBUTE_VARIETY = 5

module.exports = {
    insertMonsters: async (monsters) => {
        console.log(monsters)
        const newMonster = await Monster.bulkCreate(monsters)
        return newMonster
    },

    createMonstersForBattle: async (player) => {

        const monsters = []
        for (let loop = 0; loop < 3; loop++) {
            let monster = {
                name: DEFAULT_MONSTER_NAMES[Math.floor(Math.random() * DEFAULT_MONSTER_NAMES.length)],

                type: DEFAULT_MONSTER_TYPES[Math.floor(Math.random() * DEFAULT_MONSTER_TYPES.length)],

                strength: 1 + Math.round(Math.random() * DEFAULT_MONSTER_ATTRIBUTE_VARIETY),

                dexterity: 1 + Math.round(Math.random() * DEFAULT_MONSTER_ATTRIBUTE_VARIETY),

                intelligence: 1 + Math.round(Math.random() * DEFAULT_MONSTER_ATTRIBUTE_VARIETY),

                maxHealth: (10 * Math.round(Math.random() * DEFAULT_MONSTER_ATTRIBUTE_VARIETY)) * 1,

                currentHealth: 0,

                maxMana: (10 * Math.round(Math.random() * DEFAULT_MONSTER_ATTRIBUTE_VARIETY)) * 1,

                currentMana: 0,

                experience: 50 * 1
            }

            monster.currentHealth = monster.maxHealth
            monster.currentMana = monster.maxMana

            monsters.push(monster)

        }
        console.log(player.level)

        const newMonster = await Monster.bulkCreate(monsters)
        return newMonster
    },

    assignMonsterToBattle: async (monsterId, battleId) => {
        const monster = await Monster.update({ battleId }, { where: { id: monsterId }, returning: true })
        return monster
    },

    assignMonstersToPreBattle: async (monsterIds, preBattleId) => {
        console.log(monsterIds)
        const updatedMonsters = await Monster.update({ preBattleId }, { where: { id: monsterIds }, returning: true })
        console.log(updatedMonsters)
        return updatedMonsters
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