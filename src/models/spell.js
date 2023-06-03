const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db')

class Spell extends Model { }
Spell.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    class: {
        type: DataTypes.ENUM("mage", "warrior", "archer"),
        allowNull: false
    },

    levelAvailability: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
})



module.exports = { Spell }