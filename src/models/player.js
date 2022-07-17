const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db')


class Item extends Model { }
Item.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    itemStrength: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    itemDexterity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    itemIntelligence: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    requiredStrength: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    requiredDexterity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    requiredIntelligence: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    slot: {
        type: DataTypes.ENUM('WEAPON', 'CHEST', 'HEAD', 'RING', 'AMULET'),
        allowNull: false
    },

    equipped: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    sequelize
})

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
    },

    totalStrength: {
        type: DataTypes.VIRTUAL,
        get() {
            if (!this.equipments) return this.attributeStrength
            const playerStrength = this.attributeStrength + this.equipments.reduce((strength, item) => strength + item.itemStrength, 0)
            return playerStrength
        }
    },

    totalDexterity: {
        type: DataTypes.VIRTUAL,
        get() {
            if (!this.equipments) return this.attributeDexterity
            const playerDexterity = this.attributeDexterity + this.equipments.reduce((dexterity, item) => dexterity + item.itemDexterity, 0)
            return playerDexterity
        }
    },

    totalIntelligence: {
        type: DataTypes.VIRTUAL,
        get() {
            if (!this.equipments) return this.attributeIntelligence
            const playerIntelligence = this.attributeIntelligence + this.equipments.reduce((intelligence, item) => intelligence + item.itemIntelligence, 0)
            return playerIntelligence
        }
    },

    inventory: {
        type: DataTypes.VIRTUAL,
        get() {
            if (!this.items) return []
            return this.items.filter(item => !item.equipped)
        }
    },

    equipments: {
        type: DataTypes.VIRTUAL,
        get() {
            if (!this.items) return []
            return this.items.filter(item => item.equipped)
        }
    }
}, {
    sequelize,
    scopes: {
        withoutPassword: {
            attributes: { exclude: ['password'] },
        }
    }
})




Item.belongsTo(Player, { as: 'player', foreignKey: 'playerId' });
Player.hasMany(Item, {
    foreignKey: 'playerId',
    as: 'items'
});

module.exports = { Player, Item }