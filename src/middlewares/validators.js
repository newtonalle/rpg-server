module.exports = {
    validate: (validator) => (req, res, next) => {
        const validationResponse = validator(req.body)
        if (validationResponse.valid) {
            next()
        } else {
            res.status(422).send(validationResponse.data)
        }
    }
}