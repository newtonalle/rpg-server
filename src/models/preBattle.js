const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db')
const { Player } = require('./player')

class PreBattle extends Model { }
PreBattle.init({
    finished: {
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

PreBattle.belongsTo(Player, { as: 'player', foreignKey: 'playerId' });
Player.hasMany(PreBattle, {
    foreignKey: 'playerId',
    as: 'prebattles'
});


module.exports = { PreBattle }