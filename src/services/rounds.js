const { Round } = require('../models/round')
const {
    findPlayerById,
} = require('../repository/players')
const { Monster } = require('../models/monster')
const { Battle } = require('../models/battle')
const { Player } = require('../models/player')

const ACTION_ATTACK = 'attack'

const calculateDamage = (entity, isSelfRound) => {
    if (!isSelfRound) {
        return 0
    }
    return entity.totalDamage
}


const handleAttack = async (actionProps, isPlayerRound, battle) => {
    const playerDamageDealt = calculateDamage(battle.player, isPlayerRound)
    const monsterDamageDealt = calculateDamage(battle.monster, !isPlayerRound)
    console.log(`Handling Attack... Player Damage: ${playerDamageDealt}; Monster Damage ${monsterDamageDealt}`)

    let isFinalRound = false
    let playerWon = false
    let finalMonsterHealth = battle.monster.currentHealth - playerDamageDealt
    let finalPlayerHealth = battle.player.currentHealth - monsterDamageDealt

    if (finalMonsterHealth <= 0) {
        isFinalRound = true
        playerWon = true
        finalMonsterHealth = 0
    }

    if (finalPlayerHealth <= 0) {
        isFinalRound = true
        playerWon = false
        finalPlayerHealth = 0
    }

    const round = {
        playerDamageDealt,
        monsterDamageDealt,
        isFinalRound,
        isPlayerRound,
        playerHealthHealed: 0,
        monsterHealthHealed: 0,
        battleId: battle.id
    }

    const monsterUpdate = {
        currentHealth: finalMonsterHealth
    }

    const playerUpdate = {
        currentHealth: finalPlayerHealth
    }

    const battleUpdate = {}

    if (isFinalRound && playerWon) {
        playerUpdate.experience = battle.player.experience + battle.monster.experience

        battleUpdate.experienceGained = battle.monster.experience
        battleUpdate.finished = true
        battleUpdate.playerWon = true
    }

    if (isFinalRound && !playerWon) {
        battleUpdate.finished = true
        battleUpdate.playerWon = false
    }

    const createdRound = await Round.create(round)

    // Update monster and player
    console.log('Updating monster', monsterUpdate)
    await Monster.update(monsterUpdate, { where: { id: battle.monster.id }, returning: true, raw: true })
    console.log('Updating player', playerUpdate)
    await Player.update(playerUpdate, { where: { id: battle.player.id }, returning: true, raw: true })
    console.log('Updating battle', battleUpdate)
    if (Object.keys(battleUpdate).length) {
        await Battle.update(battleUpdate, { where: { id: battle.id }, returning: true })
    }

    return createdRound
}

const PLAYER_ACTION_HANDLERS = {
    [ACTION_ATTACK]: handleAttack
}

const MONSTER_ACTION_HANDLERS = {
    [ACTION_ATTACK]: handleAttack
}

const handlePlayerAction = async (params, battle) => {
    const handler = PLAYER_ACTION_HANDLERS[params.playerAction]

    if (!handler) {
        throw new Error(`Invalid player action: "${params.playerAction}"`)
    }

    const round = await handler(params, true, battle)

    return round
}

const handleMonsterAction = async (params, battle) => {
    const monsterAction = ACTION_ATTACK
    const handler = MONSTER_ACTION_HANDLERS[monsterAction]

    if (!handler) {
        throw new Error(`Invalid player action: "${monsterAction}"`)
    }

    const round = await handler(params, false, battle)

    return round
}

module.exports = {
    handlePlayerAction,
    handleMonsterAction
}