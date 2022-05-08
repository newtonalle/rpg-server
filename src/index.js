const express = require('express')
const playersRoutes = require('./routes/players')
const authRoutes = require('./routes/auth')
const app = express()
const { authenticated } = require('./middlewares/auth')
const { validate } = require('./middlewares/validators')
const { validatePlayer } = require('./validators/playerValidator')
const { syncAll } = require('./models')

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

// Middleware pré-pronto do express que processa requisições com o conteudo (body) JSON
syncAll()
app.use(express.json())

app.get('/players/', playersRoutes.list)
app.post('/auth/login', authRoutes.login)
app.get('/me', authenticated, playersRoutes.me)
app.get('/players/:id', playersRoutes.get)
app.delete('/players/:id', playersRoutes.delete)
app.post('/players/', validate(validatePlayer), playersRoutes.create)
app.put('/players/:id', authenticated, playersRoutes.put)




app.listen(3000)