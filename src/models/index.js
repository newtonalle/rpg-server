const { Item, Player } = require("../models/player")

const syncAll = async () => {
    try {
        await Player.sync()
        await Item.sync()
    } catch (e) {
        console.log('Failed to sync', e)
    }
}

module.exports = { syncAll }