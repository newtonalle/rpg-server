const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db')
const { Player } = require('./player')

class User extends Model { }
User.init({
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
    }
}, {
    sequelize,
    scopes: {
        withoutPassword: {
            attributes: { exclude: ['password'] },
        }
    }
})

Player.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(Player, {
    foreignKey: 'userId',
    as: 'players'
});

module.exports = { User }