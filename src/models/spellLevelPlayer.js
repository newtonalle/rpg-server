const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db')
const { Player } = require('./player')
const { SpellLevel } = require('./spellLevel')

class SpellLevelPlayer extends Model { }
SpellLevelPlayer.init({
    isEquipped: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    sequelize,
})

SpellLevelPlayer.belongsTo(Player, { as: 'player', foreignKey: 'playerId' });
Player.hasMany(SpellLevelPlayer, {
    foreignKey: 'playerId',
    as: 'spellLevelPlayers'
});

SpellLevelPlayer.belongsTo(SpellLevel, { as: 'spellLevel', foreignKey: { field: 'spellLevelId', allowNull: false } });
SpellLevel.hasMany(SpellLevelPlayer, {
    foreignKey: 'spellLevelId',
    as: 'spellLevelPlayers'
});


module.exports = { SpellLevelPlayer }