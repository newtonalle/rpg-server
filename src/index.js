const express = require('express')
const usersRoutes = require('./routes/users')
const playersRoutes = require('./routes/players')
const classesRoutes = require('./routes/classes')
const itemsRoutes = require('./routes/items')
const spellsRoutes = require('./routes/spells')
const battlesRoutes = require('./routes/battles')
const preBattlesRoutes = require('./routes/preBattles')
const roundsRoutes = require('./routes/rounds')
const monstersRoutes = require('./routes/monsters')
const authRoutes = require('./routes/auth')
const app = express()
const { authenticated } = require('./middlewares/auth')
const { validate } = require('./middlewares/validators')
const { validatePlayer } = require('./validators/playerValidator')
const { validateUser } = require('./validators/userValidator')
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

// User Routes

app.post('/users/', validate(validateUser), usersRoutes.create)
app.delete('/users/:id', usersRoutes.delete)
app.get('/users/:id', usersRoutes.get)
app.put('/users/:id', authenticated, usersRoutes.put)
app.get('/me', authenticated, usersRoutes.me)

// Player Routes

app.post('/users/:userId/players/classes/:classId', validate(validatePlayer), authenticated, playersRoutes.create)
app.get('/users/select-player/:id', authenticated, playersRoutes.selectPlayer)
app.delete('/users/players/:id', playersRoutes.delete)
app.get('/users/players/:id', playersRoutes.get)
app.put('/users/players/:id', authenticated, playersRoutes.put)
app.get('/users/:userId/players/', playersRoutes.list)
app.get('/current-player', authenticated, playersRoutes.me)
app.put('/users/players/:playerId/attributeUp', authenticated, playersRoutes.addAtributtePoints)

// Class Routes

app.get('/classes/:id', classesRoutes.get)
app.get('/classes/', classesRoutes.list)

// Player-Inventory Routes

app.put('/users/players/:playerId/inventory/:itemId', itemsRoutes.addItemToPlayerInventory)
app.put('/users/players/:playerId/spells/:spellLevelPlayerId', spellsRoutes.addSpellToPlayer)
app.put('/users/players/inventory/:id', playersRoutes.toggleItem)
app.put('/users/players/spells/:id', playersRoutes.toggleSpell)

app.get('/users/players/:id/inventory', playersRoutes.listInventory)

// Player-Battle Routes

app.get('/battle-history', authenticated, playersRoutes.battleHistory)
app.get('/current-battle', authenticated, battlesRoutes.getCurrentBattle)

// Player/Pre-Battle Routes

app.get('/pre-battles/users/player', authenticated, preBattlesRoutes.getCurrentPreBattle)

// Item Routes

app.get('/items/:id', itemsRoutes.getItem)

// Spell Routes

app.post('/spells/level/player', spellsRoutes.addSpellLevelPlayer)
app.post('/spells/level', spellsRoutes.addSpellLevel)
app.post('/spells/', spellsRoutes.addSpell)

app.get('/spells/level/player/:id', spellsRoutes.getSpellLevelPlayerById)
app.get('/spells/level/:id', spellsRoutes.getSpellLevelById)
app.get('/spells/:id', spellsRoutes.getSpellById)

app.get('/spells/level/player/', spellsRoutes.listSpellLevelPlayers)
app.get('/spells/level/', spellsRoutes.listSpellLevels)
app.get('/spells/', spellsRoutes.listSpells)

app.post('/players/:playerId/spells/:spellLevelPlayerId/levelup', spellsRoutes.levelUpSpell)
app.post('/players/:playerId/spells/:spellId/learn', spellsRoutes.learnSpell)

// Battle-Monster-Round Routes

app.post('/battles/', authenticated, battlesRoutes.create)
app.post('/battles/:battleId/rounds', authenticated, roundsRoutes.create)
app.get('/battles/', battlesRoutes.list)
app.get('/battles/:battleId', battlesRoutes.get)
app.get('/battles/:battleId/rounds', roundsRoutes.list)

// Pre Battle Routes

app.post('/pre-battles/', authenticated, preBattlesRoutes.create) // Create Pre Battle, the ncrate monsters, then assign monsters to pre battle
app.get('/pre-battles/', preBattlesRoutes.list)

// Monster Routes

app.post('/monsters/', authenticated, monstersRoutes.createMonstersForBattle)
app.get('/monsters/', monstersRoutes.list)

// +------+ Port 3000 +------+

app.listen(3000)