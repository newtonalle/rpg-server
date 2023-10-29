const { Class } = require('../models/class')

const {
    findClassById,
    listClasses,
} = require('../repository/classes')

module.exports = {
    get: async (req, res) => {
        const playerClass = await findClassById(Number(req.params.id))

        if (playerClass) {
            res.send(playerClass)
        }
        else {
            res.status(404).send({
                message: 'No "playerClass" available using that ID',
            })
        }
    },

    list: async (req, res) => {
        console.log("asdsadasdsadasdasdasdas")
        const classesList = await listClasses()
        res.send(classesList)
    },
}