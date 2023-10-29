const { Round } = require('../models/round')
const {
    findSpellLevelPlayerById,
} = require('../repository/spells')
const { Monster } = require('../models/monster')
const { Battle } = require('../models/battle')
const { Player } = require('../models/player')

const ACTION_ATTACK = 'attack'
const ACTION_RUN = 'run'
const ACTION_SPELL = 'spell'

const BASE_ESCAPE_CHANCE = 50 // Percentage of chance (Ex. 50%, or half the time, the action succeds)

const calculateDamage = (entity, isSelfRound) => {
    if (!isSelfRound) {
        return 0
    }
    return entity.totalDamage
}

const calculateSpellStatus = async (actionProps, isSelfRound) => {
    if (!isSelfRound) {
        return 0
    }
    console.log(actionProps)

    const spellLevelPlayer = await findSpellLevelPlayerById(actionProps.spellLevelPlayerId)

    console.log(spellLevelPlayer.spellLevel)

    const damage = spellLevelPlayer.spellLevel.damage

    const manaCost = spellLevelPlayer.spellLevel.manaCost


    return {
        damage,
        manaCost
    }
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
        playerUpdate.gold = battle.player.gold + battle.monster.gold

        battleUpdate.experienceGained = battle.monster.experience
        battleUpdate.finished = true
        battleUpdate.playerWon = true
    }

    if (isFinalRound && !playerWon) {
        battleUpdate.finished = true
        battleUpdate.playerWon = false
    }

    const createdRound = await Round.create(round)

    await Player.update(playerUpdate, { where: { id: battle.player.id }, returning: true, raw: true })
    await Monster.update(monsterUpdate, { where: { id: battle.monster.id }, returning: true, raw: true })
    if (Object.keys(battleUpdate).length) {
        await Battle.update(battleUpdate, { where: { id: battle.id }, returning: true })
    }

    const updatedPlayer = await Player.findOne({ where: { id: battle.player.id } })
    if (updatedPlayer.level > battle.player.level) {
        await Player.update({ unallocatedSpellLevels: battle.player.unallocatedSpellLevels + 1, unallocatedAttributePoints: battle.player.unallocatedAttributePoints + 5 }, { where: { id: battle.player.id }, returning: true, raw: true })
    }

    return createdRound
}

const handleRun = async (actionProps, isPlayerRound, battle) => {
    console.log(`Handling Run...`)

    const battleUpdate = {}

    const round = {
        playerDamageDealt: 0,
        monsterDamageDealt: 0,
        isPlayerRound,
        playerHealthHealed: 0,
        monsterHealthHealed: 0,
        battleId: battle.id
    }

    if (Math.floor(Math.random() * 100) < BASE_ESCAPE_CHANCE) {

        // Success

        round.isFinalRound = true

        battleUpdate.finished = true
        battleUpdate.playerWon = false
    } else {

        // Fail

        round.isFinalRound = false

    }

    const createdRound = await Round.create(round)

    if (Object.keys(battleUpdate).length) {
        await Battle.update(battleUpdate, { where: { id: battle.id }, returning: true })
    }

    return createdRound
}

const handleSpell = async (actionProps, isPlayerRound, battle) => {
    const spellStatus = await calculateSpellStatus(actionProps, isPlayerRound)
    const monsterDamageDealt = 0
    let playerDamageDealt = spellStatus.damage
    let manaCost = spellStatus.manaCost

    console.log(`Handling Spell... Player Damage: ${spellStatus.damage}; Mana Cost: ${spellStatus.manaCost}; Spell: ${actionProps.spellLevelPlayerId}`)

    if (spellStatus.manaCost > battle.player.currentMana) {
        console.log(`Spell failed! Not enough mana: ${battle.player.currentMana}`)
        playerDamageDealt = 0
        manaCost = 0
    }

    let isFinalRound = false
    let playerWon = false

    let finalMonsterHealth = battle.monster.currentHealth - playerDamageDealt
    let finalPlayerHealth = battle.player.currentHealth - monsterDamageDealt

    let finalPlayerMana = battle.player.currentMana - manaCost

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
        currentHealth: finalPlayerHealth,
        currentMana: finalPlayerMana
    }

    const battleUpdate = {}

    if (isFinalRound && playerWon) {
        playerUpdate.experience = battle.player.experience + battle.monster.experience
        playerUpdate.gold = battle.player.gold + battle.monster.gold

        battleUpdate.experienceGained = battle.monster.experience
        battleUpdate.finished = true
        battleUpdate.playerWon = true
    }

    if (isFinalRound && !playerWon) {
        battleUpdate.finished = true
        battleUpdate.playerWon = false
    }

    const createdRound = await Round.create(round)


    await Player.update(playerUpdate, { where: { id: battle.player.id }, returning: true, raw: true })
    await Monster.update(monsterUpdate, { where: { id: battle.monster.id }, returning: true, raw: true })
    if (Object.keys(battleUpdate).length) {
        await Battle.update(battleUpdate, { where: { id: battle.id }, returning: true })
    }

    const updatedPlayer = await Player.findOne({ where: { id: battle.player.id } })
    if (updatedPlayer.level > battle.player.level) {
        await Player.update({ unallocatedSpellLevels: battle.player.unallocatedSpellLevels + 1, unallocatedAttributePoints: battle.player.unallocatedAttributePoints + 5 }, { where: { id: battle.player.id }, returning: true, raw: true })
    }

    return createdRound
}

const PLAYER_ACTION_HANDLERS = {
    [ACTION_ATTACK]: handleAttack,
    [ACTION_RUN]: handleRun,
    [ACTION_SPELL]: handleSpell,
}

const MONSTER_ACTION_HANDLERS = {
    [ACTION_ATTACK]: handleAttack
}

const handlePlayerAction = async (params, battle) => {
    const handler = PLAYER_ACTION_HANDLERS[params.playerAction]

    if (!handler) {
        throw new Error(`Invalid player action: "${params.playerAction}"`)
    }

    const round = await handler(params.actionProps, true, battle)

    return round
}

const handleMonsterAction = async (params, battle) => {

    // Fazer IA dos monstros

    const monsterAction = ACTION_ATTACK
    const handler = MONSTER_ACTION_HANDLERS[monsterAction]

    if (!handler) {
        throw new Error(`Invalid monster action: "${monsterAction}"`)
    }

    const round = await handler(params, false, battle)

    return round
}

module.exports = {
    handlePlayerAction,
    handleMonsterAction
}