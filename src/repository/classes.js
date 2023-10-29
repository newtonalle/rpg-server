const { Class } = require('../models/class')

module.exports = {
    findClassById: async (id) => {
        const playerClass = await Class.findOne({ where: { id }, include: ['spells'] })
        return playerClass
    },
    listClasses: async () => {
        const playerClass = await Class.findAll()
        return playerClass
    },
}