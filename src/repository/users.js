const { User } = require('../models/user')

module.exports = {
    findUserById: async (id) => {
        const user = await User.scope('withoutPassword').findOne({ where: { id } })
        return user
    },
    insertUser: async (user) => {
        const newUser = await User.scope('withoutPassword').create(User)
        return newUser
    },
    deleteUserById: async (id) => {
        const count = await User.destroy({ where: { id } })
        return count > 0
    },
    editUserById: async (id, bodyUser) => {
        const [count] = await User.update(bodyUser, { where: { id }, returning: true })
        return count > 0
    },
    findUserByEmail: async (email) => {
        const user = await User.findOne({ where: { email } })
        return user
    }
}