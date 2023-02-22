const express = require('express')
const playersRoutes = require('./routes/players')
const itemsRoutes = require('./routes/items')
const battlesRoutes = require('./routes/battles')
const roundsRoutes = require('./routes/rounds')
const monstersRoutes = require('./routes/monsters')
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

// +------+ HTML REQUESTS +------+

// Authentification Routes

app.post('/auth/login', authRoutes.login)

// Player Routes

app.post('/players/', validate(validatePlayer), playersRoutes.create)
app.delete('/players/:id', playersRoutes.delete)
app.get('/players/:id', playersRoutes.get)
app.put('/players/:id', authenticated, playersRoutes.put)
app.get('/players/', playersRoutes.list)
app.get('/me', authenticated, playersRoutes.me)

// Player-Inventory Routes

app.put('/players/:playerId/inventory/:itemId', itemsRoutes.addItemToPlayerInventory)
app.put('/players/inventory/:id', playersRoutes.toggleItem)
app.get('/players/:id/inventory', playersRoutes.listInventory)

// Player-Battle Routes

app.get('/players/:id/battles', playersRoutes.listBattles)
app.get('/battles/player', authenticated, battlesRoutes.getCurrentBattle)

// Item Routes

app.get('/items/:id', itemsRoutes.getItem)

// Battle-Monster-Round Routes

app.post('/battles/', authenticated, battlesRoutes.create)
app.post('/battles/:battleId/rounds', authenticated, roundsRoutes.create)
app.get('/battles/', battlesRoutes.list)
app.get('/battles/:battleId/rounds', roundsRoutes.list)

// Monster Routes

app.post('/monsters/', authenticated, monstersRoutes.createMonstersForBattle)
app.get('/monsters/', monstersRoutes.list)

// +------+ Port 3000 +------+

app.listen(3000)