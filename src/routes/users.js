const { generatePasswordHash } = require('../helpers/auth')

const {
    findUserById,
    insertUser,
    deleteUserById,
    editUserById
} = require('../repository/users')
module.exports = {
    // Req é a requisição HTTP recebida
    // Res é a response HTTP que vai ser enviada para o cliente
    me: async (req, res) => {

        const player = await findUserById(req.tokenPayload.id)
        res.status(200).send(player)
    },

    create: async (req, res) => {
        const user = req.body
        user.password = generatePasswordHash(user.password)
        try {
            const newUser = await insertUser(user)
            res.status(201).send({ message: 'User created', data: newUser })
        } catch (e) {
            console.log(e)
            res.status(422).json({
                message: 'Email taken',
            })
        }

    },

    get: async (req, res) => {
        try {
            const user = await findUserById(Number(req.params.id))
            if (user) {
                res.send(user)
            }
            else {
                res.status(404).send({
                    message: 'No user available using that ID',
                })
            }
        } catch (e) {
            console.log(e)
            res.status(500).send({ message: e })
        }
    },

    delete: async (req, res) => {
        const userId = Number(req.params.id)
        if (req.tokenPayload.id !== userId) {
            res.status(401).send({ message: 'Cannot delete user that is not self' })
            return
        }
        const userDeleted = await deleteUserById(userId)
        if (userDeleted) {
            res.send({ message: 'User deleted' })
        } else {
            res.status(404).send({
                message: 'No user available using that ID',
            })
        }
    },

    put: async (req, res) => {
        const userId = Number(req.params.id)
        if (req.tokenPayload.id !== userId) {
            res.status(401).send({ message: 'Cannot edit user that is not self' })
            return
        }
        if (req.body.password) {
            req.body.password = generatePasswordHash(req.body.password)
        }

        const userEdited = await editUserById(userId, req.body)
        if (userEdited) {
            res.send({ message: 'User edited' })
        }
        else {
            res.status(404).send({
                message: 'No user available using that ID',
            })
        }
    },
}