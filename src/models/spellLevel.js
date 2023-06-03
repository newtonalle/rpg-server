const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db')
const { Spell } = require('./spell')

class SpellLevel extends Model { }
SpellLevel.init({
    level: {
        type: DataTypes.STRING,
        allowNull: false
    },

    manaCost: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    damage: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize,
})

SpellLevel.belongsTo(Spell, { as: 'spell', foreignKey: { field: 'spellId', allowNull: false } });
Spell.hasMany(SpellLevel, {
    foreignKey: 'spellId',
    as: 'spellLevels'
});

module.exports = { SpellLevel }