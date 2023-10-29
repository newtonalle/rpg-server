const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db')
const BASE_EXPERIENCE = 100
const EXPERIENCE_GROWTH_RATE = 1.5


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

    experience: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    gold: {
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

    unallocatedSpellLevels: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },

    unallocatedAttributePoints: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },

    currentMana: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    extraDexterity: {
        type: DataTypes.VIRTUAL,
        get() {
            if (!this.equipments) return 0
            return this.equipments.reduce((dexterity, item) => dexterity + item.itemDexterity, 0)
        }
    },

    extraIntelligence: {
        type: DataTypes.VIRTUAL,
        get() {
            if (!this.equipments) return 0
            return this.equipments.reduce((intelligence, item) => intelligence + item.itemIntelligence, 0)
        }
    },

    extraStrength: {
        type: DataTypes.VIRTUAL,
        get() {
            if (!this.equipments) return 0
            return this.equipments.reduce((strength, item) => strength + item.itemStrength, 0)
        }
    },

    totalDexterity: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.attributeDexterity + this.extraDexterity
        }
    },

    totalIntelligence: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.attributeIntelligence + this.extraIntelligence
        }
    },
    totalStrength: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.attributeStrength + this.extraStrength
        }
    },

    totalDamage: {
        type: DataTypes.VIRTUAL,
        get() {
            const attributeValues = {
                STRENGTH: this.totalStrength,
                DEXTERITY: this.totalDexterity,
                INTELLIGENCE: this.totalIntelligence
            }
            if (!this.class) return 0
            return attributeValues[this.class.mainDamageAttribute]
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
        fullPlayer: {
            include: ['class', 'items']
        }
    }
})

Item.belongsTo(Player, { as: 'player', foreignKey: 'playerId' });
Player.hasMany(Item, {
    foreignKey: 'playerId',
    as: 'items'
});

module.exports = { Player, Item }