const { Login } = require('../validations/auth')
const { findPlayerByEmail } = require('../repository/players')
const { generatePasswordHash, generateLoginToken } = require('../helpers/auth')

module.exports = {
    login: async (req, res) => {
        const { value: login, error } = Login.validate(req.body)
        if (error !== undefined) {
            return res.status(422).json({
                message: 'Invalid request',
                error: error && error.details
            })
        }

        const player = await findPlayerByEmail(login.email)

        if (player && player.password === generatePasswordHash(login.password)) {
            res.status(200).json({
                message: 'Login succesful',
                token: generateLoginToken(player)
            })
        } else {
            res.status(401).json({
                message: 'Failed to login'
            })
        }
    }
}