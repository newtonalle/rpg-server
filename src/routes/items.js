const {
    findItemById,
    setItemPlayerId,
} = require('../repository/items')
module.exports = {
    getItem: async (req, res) => {
        const item = await findItemById(Number(req.params.id))

        if (item) {
            res.send(item)
        }
        else {
            res.status(404).send({
                message: 'No item available using that ID',
            })
        }

    },

    addItemToPlayerInventory: async (req, res) => {
        const item = await setItemPlayerId(req.params.itemId, req.params.playerId)
        res.status(201).send({ message: 'Item attributed to player', data: item })
    },

}