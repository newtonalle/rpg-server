const { verifyAuthorizationToken } = require('../helpers/auth')

module.exports = {
    authenticated: (req, res, next) => {
        try {
            req.tokenPayload = verifyAuthorizationToken(req.headers.authorization)
            next()
        } catch (e) {
            res.status(401).send({ message: 'Unauthenticated' })
        }
    }
}