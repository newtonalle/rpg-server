const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db')
const BASE_EXPERIENCE = 100
const EXPERIENCE_GROWTH_RATE = 1.5
const CLASS_MAIN_DAMAGE = {
    mage: 'totalIntelligence',
    warrior: 'totalStrength',
    archer: 'totalDexterity',
}


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

    experience: {
        type: DataTypes.INTEGER,
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

    maxHealth: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    currentHealth: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    maxMana: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    currentMana: {
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

    totalDamage: {
        type: DataTypes.VIRTUAL,
        get() {
            return this[CLASS_MAIN_DAMAGE[this.class]]
        }
    },

    level: {
        type: DataTypes.VIRTUAL,
        get() {
            // Formula:

            // Considering BASE_EXPERIENCE as 100 & EXPERIENCE_GROWTH_RATE as 1.5

            // 100 * (1.5^n - 1.5) = EXP
            // log(1.5^n) = log(EXP / 100 + 1.5)
            // n * log(1.5) = log(EXP / 100 + 1.5)

            // n = log(EXP / 100 + 1.5) / log(1.5)

            return Math.floor(Math.log(this.experience / BASE_EXPERIENCE + EXPERIENCE_GROWTH_RATE) / Math.log(EXPERIENCE_GROWTH_RATE))
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