const jwt = require('jsonwebtoken')
const crypto = require('crypto')

module.exports = {
    generatePasswordHash: (passwordText) => {
        return crypto.createHash('sha256').update(passwordText).digest('hex')
    },
    generateLoginToken: (user) => {
        return jwt.sign({ id: user.id }, 'cocozinho')
    },
    generatePlayerUserToken: (user, player) => {
        const token = jwt.sign({ id: user.id, playerId: player.id }, 'cocozinho')
        const payload = jwt.verify(token, 'cocozinho')
        return token
    },
    verifyAuthorizationToken: (authorization) => {
        const token = authorization.replace('Bearer ', '')
        const payload = jwt.verify(token, 'cocozinho')
        return payload
    }
}