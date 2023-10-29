const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db')
const { Player } = require('./player')
const { Spell } = require('./spell')

class Class extends Model { }
Class.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    mainDamageAttribute: {
        type: DataTypes.ENUM('STRENGTH', 'DEXTERITY', 'INTELLIGENCE'),
        allowNull: false
    },

    baseStrength: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    baseDexterity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    baseIntelligence: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

}, {
    sequelize,
})

Player.belongsTo(Class, { as: 'class', foreignKey: 'classId' });
Class.hasMany(Player, {
    foreignKey: 'classId',
    as: 'players'
});

Spell.belongsTo(Class, { as: 'class', foreignKey: 'classId' });
Class.hasMany(Spell, {
    foreignKey: 'classId',
    as: 'spells'
});

module.exports = { Class }