const { User } = require('../validations/user')

module.exports = {
    validateUser: (user) => {
        const { value: validationUser, error } = User.validate(user)

        if (error !== undefined) {
            return {
                valid: false,
                data: {
                    message: 'Invalid request',
                    data: user,
                    error: error && error.details
                }
            }
        } else {
            return {
                valid: true,
                data: validationUser
            }
        }
    }
}