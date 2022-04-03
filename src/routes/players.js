const { Player } = require('../models/player')

const players = []

module.exports = {
    // Req é a requisição HTTP recebida
    // Res é a response HTTP que vai ser enviada para o cliente
    list: (req, res) => {
        res.send(players)
    },

    create: (req, res) => {
        const { value: player, error } = Player.validate(req.body)
        if (error !== undefined) {
            return res.status(422).json({
                message: 'Invalid request',
                data: player,
                error: error && error.details
            })
        }

        players.push(player)
        res.status(201).send({ message: 'Player created' })
    },

    get: (req, res) => {
        console.log('Listando player', req.params.id)
        res.send({ asdokasod: 'ok2' })
    }
}