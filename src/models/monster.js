const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db')
const { Battle } = require('./battle')
const { PreBattle } = require('./preBattle')

class Monster extends Model { }
Monster.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    type: {
        type: DataTypes.STRING,
        allowNull: false
    },

    strength: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    dexterity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    intelligence: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    maxHealth: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    currentHealth: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    maxMana: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    currentMana: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    experience: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    totalDamage: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.strength
        }
    },
}, {
    sequelize
})

Monster.belongsTo(Battle, { as: 'battle', foreignKey: 'battleId' });
Battle.hasOne(Monster, {
    foreignKey: 'battleId',
    as: 'monster'
});

Monster.belongsTo(PreBattle, { as: 'preBattle', foreignKey: 'preBattleId' });
PreBattle.hasMany(Monster, {
    foreignKey: 'preBattleId',
    as: 'monster'
});

module.exports = { Monster }