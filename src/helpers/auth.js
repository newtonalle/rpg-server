const jwt = require('jsonwebtoken')
const crypto = require('crypto')

module.exports = {
    generatePasswordHash: (passwordText) => {
        return crypto.createHash('sha256').update(passwordText).digest('hex')
    },
    generateLoginToken: (player) => {
        return jwt.sign({ id: player.id }, 'cocozinho')
    },
    verifyAuthorizationToken: (authorization) => {
        const token = authorization.replace('Bearer ', '')
        const payload = jwt.verify(token, 'cocozinho')
        return payload
    }
}