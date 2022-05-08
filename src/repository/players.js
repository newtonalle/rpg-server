const { pool } = require('../db')

module.exports = {
    findPlayerById: async (id) => {

        const player = (await pool`
        SELECT *
        FROM players where id = ${id}
        `)[0]

        if (!player) {
            return null
        } else {
            return {
                name: player.name,
                class: player.class,
                email: player.email,
                attributes: player.attributes,
                id: player.id
            }
        }
    },
    insertPlayer: async (player) => {
        const [newPlayer] = await pool`
            INSERT INTO players  ${pool(
            player,
            'name',
            'email',
            'password',
            'class'
        )} returning *
        `
        delete newPlayer.password
        return newPlayer
    },
    listPlayers: async () => {
        const playersList = (await pool`
        SELECT *
        FROM players
        `)

        return playersList.map(player => ({
            name: player.name,
            email: player.email,
            class: player.class,
            id: player.id,
        })
        )
    },
    deletePlayerById: async (id) => {
        const deletedIds = await pool`DELETE FROM players where id = ${id} RETURNING id`

        if (deletedIds.length > 0) {
            return true
        }
        else {
            return false
        }
    },
    editPlayerById: async (id, bodyPlayer) => {
        const updatedIds = await pool`
        UPDATE players SET name = ${bodyPlayer.name}, class = ${bodyPlayer.class} where id = ${id} returning id
        `

        if (updatedIds.length > 0) {

            return true
        } else {
            return false
        }
    },
    findPlayerByEmail: async (email) => {
        const player = (await pool`
        SELECT *
        FROM players where email = ${email}
        `)

        return player
    }
}