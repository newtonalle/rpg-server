const { User } = require("../models/user")
const { Item, Player } = require("../models/player")
const { Monster } = require("../models/monster")
const { Battle } = require("../models/battle")
const { PreBattle } = require("../models/preBattle")
const { Round } = require("../models/round")
const { Spell } = require("../models/spell")
const { SpellLevel } = require("../models/spellLevel")
const { SpellLevelPlayer } = require("../models/spellLevelPlayer")
const { Class } = require("../models/class")


const syncAll = async () => {
    try {
        await User.sync()
        await Class.sync()
        await Player.sync()
        await Battle.sync()
        await PreBattle.sync()
        await Item.sync()
        await Monster.sync()
        await Round.sync()
        await Spell.sync()
        await SpellLevel.sync()
        await SpellLevelPlayer.sync()

    } catch (e) {
        console.log('Failed to sync', e)
    }
}

module.exports = { syncAll }