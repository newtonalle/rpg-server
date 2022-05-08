const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    username: 'postgres',
    password: 'mysecretpassword'
})

// Pool eh uma piscina de conexoes.
// Cada requisicao vai usar uma conexao:
//   1 - tirar conexao da pool
//   2 - usar conexao
//   3 - devolver conexao pra pool

module.exports = { sequelize }