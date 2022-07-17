const { Item } = require('../models/player')
const { Player } = require('../models/player')

module.exports = {
    findItemById: async (id) => {
        const item = await Item.findOne({ where: { id } })
        return item
    },

    toggleItemById: async (id) => {
        const item = await Item.findOne({ where: { id } })
        let player = await Player.scope('withoutPassword').findOne({ where: { id: item.playerId }, include: ['items'] })

        await Item.update({ equipped: false }, { where: { playerId: item.playerId, slot: item.slot }, returning: true })
        await Item.update({ equipped: !item.equipped }, { where: { id }, returning: true })


        // Removal of now invalid items

        player = await Player.scope('withoutPassword').findOne({ where: { id: item.playerId }, include: ['items'] })

        let unequipedIds = []

        do {
            unequipedIds = []
            for (const equipment of player.equipments) {
                if (equipment.requiredStrength > player.totalStrength || equipment.requiredDexterity > player.totalDexterity || equipment.requiredIntelligence > player.totalIntelligence) {
                    unequipedIds.push(equipment.id)
                }
            }

            await Item.update({ equipped: false }, { where: { id: unequipedIds }, returning: true })
            player = await Player.scope('withoutPassword').findOne({ where: { id: item.playerId }, include: ['items'] })

        } while (unequipedIds.length > 0)

        return true

    },

    insertItem: async (item) => {
        const newItem = await Item.create(item)
        return newItem
    },

    setItemPlayerId: async (itemId, playerId) => {
        const item = await Item.update({ playerId }, { where: { id: itemId }, returning: true })
        return item
    }

}