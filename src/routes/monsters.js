const { Monster } = require('../models/monster')
const DEFAULT_MONSTER_NAMES = ['Revirlo', 'Fresckins', 'Alapart', 'Portyu', 'Refgik', 'Kerfto']
const DEFAULT_MONSTER_TYPES = ['Skeleton', 'Zombie', 'Ghost', 'Spider', 'Verm', 'Rat']
const DEFAULT_MONSTER_ATTRIBUTE_VARIETY = 5
const {
    insertMonsters,
    assignMonsterToBattle,
    listMonsters,
} = require('../repository/monsters')
const {
    findPlayerById,
} = require('../repository/players')
module.exports = {
    createMonstersForBattle: async (req, res) => {
        const monsters = []
        const player = await findPlayerById(req.tokenPayload.id)
        for (let loop = 0; loop < 3; loop++) {
            let monster = {
                name: DEFAULT_MONSTER_NAMES[Math.floor(Math.random() * DEFAULT_MONSTER_NAMES.length)],

                type: DEFAULT_MONSTER_TYPES[Math.floor(Math.random() * DEFAULT_MONSTER_TYPES.length)],

                strength: player.level + Math.round(Math.random() * DEFAULT_MONSTER_ATTRIBUTE_VARIETY),

                dexterity: player.level + Math.round(Math.random() * DEFAULT_MONSTER_ATTRIBUTE_VARIETY),

                intelligence: player.level + Math.round(Math.random() * DEFAULT_MONSTER_ATTRIBUTE_VARIETY),

                maxHealth: (10 * Math.round(Math.random() * DEFAULT_MONSTER_ATTRIBUTE_VARIETY)) * player.level,

                currentHealth: 0,

                maxMana: (10 * Math.round(Math.random() * DEFAULT_MONSTER_ATTRIBUTE_VARIETY)) * player.level,

                currentMana: 0,

                experience: 50 * player.level
            }

            monster.currentHealth = monster.maxHealth
            monster.currentMana = monster.maxMana

            monsters.push(monster)

        }
        const response = await insertMonsters(monsters)
        res.status(201).send({ message: 'Monsters created', data: response })
    },

    assignToBattle: async (req, res) => {
        const monsterId = req.params.monsterId
        const battleId = req.params.battleId

        const monster = await Monster.findOne({ where: { id: monsterId } })

        if (monster === null) {
            res.status(404).send({ message: 'No monster available using that ID', data: monster })
        }
        const updatedMonster = await assignMonsterToBattle(monsterId, battleId)
        res.status(201).send({ message: 'Monster assigned to battle', data: updatedMonster })
    },

    list: async (req, res) => {
        const monstersList = await listMonsters()
        res.send(monstersList)
    },
}