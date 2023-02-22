const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db')
const { Player } = require('./player')

class Battle extends Model { }
Battle.init({
    finished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },

    playerWon: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },

    experienceGained: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },

    isPlayerRound: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
}, {
    sequelize,
    scopes: {
        withoutPlayerId: {
            attributes: { exclude: ['playerId'] },
        }
    }
})

Battle.belongsTo(Player, { as: 'player', foreignKey: 'playerId' });
Player.hasMany(Battle, {
    foreignKey: 'playerId',
    as: 'battles'
});


module.exports = { Battle }