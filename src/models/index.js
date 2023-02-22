const { Item, Player } = require("../models/player")
const { Monster } = require("../models/monster")
const { Battle } = require("../models/battle")
const { Round } = require("../models/round")

const syncAll = async () => {
    try {
        await Player.sync()
        await Battle.sync()
        await Item.sync()
        await Monster.sync()
        await Round.sync()
    } catch (e) {
        console.log('Failed to sync', e)
    }
}

module.exports = { syncAll }