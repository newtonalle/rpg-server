const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db')

class Player extends Model { }
Player.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    class: {
        type: DataTypes.ENUM("mage", "warrior", "archer"),
        allowNull: false
    },

    attributeStrength: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    attributeDexterity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    attributeIntelligence: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    scopes: {
        withoutPassword: {
            attributes: { exclude: ['password'] },
        }
    }
})

module.exports = { Player }