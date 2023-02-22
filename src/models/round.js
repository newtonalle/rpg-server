const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db')
const { Battle } = require('./battle')

class Round extends Model { }
Round.init({
    isFinalRound: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },

    isPlayerRound: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },

    playerDamageDealt: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },

    monsterDamageDealt: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },

    playerHealthHealed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },

    monsterHealthHealed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
}, {
    sequelize
})

Round.belongsTo(Battle, { as: 'battle', foreignKey: 'battleId' });
Battle.hasMany(Round, {
    foreignKey: 'battleId',
    as: 'rounds'
});

module.exports = { Round }