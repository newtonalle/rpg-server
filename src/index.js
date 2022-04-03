const express = require('express')
const playersRoutes = require('./routes/players')
const app = express()

/*
Tipos de requisição HTTP

GET - Usado para pegar coisas do servidor. Não deve alter nada no servidor (sem side-effect)
POST - Usado para criar coisas no servidor. Por exemplo criar um usuário novo.
PUT - Usado para alterar coisas no servidor. Por exemplo, alterar o nome de um usuário
DELETE - Usado para apagar coisas no servidor. Por exemplo, deletar um usuário
*/

/*
Middlewares são funções que são executadas entre o servidor receber a requisição
e a função da rota ser executada (por isso é no meio, middleware).
*/

app.use((req, res) => {
    console.log('Estou no middleware')
    return req.next()
})

// Middleware pré-pronto do express que processa requisições com o conteudo (body) JSON
app.use(express.json())

app.get('/players/', playersRoutes.list)
app.post('/players/', playersRoutes.create)
app.get('/players/:id', playersRoutes.get)

app.listen(3000)