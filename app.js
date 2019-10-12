const path = require('path')
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const { Player, Game, state } = require('./game')
const routes = require('./routes')

const app = express()
const httpServer = http.createServer(app)
const io = socketIo(httpServer)

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', routes)

io.on('connection', (socket) => {
  console.log('Connected:', socket.id)
  state.sockets[socket.id] = socket
  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id)
    if (state.sockets[socket.id].game) {
      state.sockets[socket.id].game.removePlayer(socket.id)
    }
    delete state.sockets[socket.id]
    console.log('PLAYER_LEFT', state.games, Object.keys(state.sockets))
  })

  socket.on('START_GAME', (msg) => {
    const player = new Player(socket.id, msg.username)
    const game = new Game(player)
    state.sockets[socket.id].game = game
    socket.emit('GAME_CREATED', { gameId: game.id, createdAt: game.createdAt })
    console.log('GAME_CREATED', state.games, Object.keys(state.sockets))
  })

  socket.on('JOIN_GAME', (msg) => {
    const player = new Player(socket.id, msg.username)
    const game = state.games[msg.gameId]
    state.sockets[socket.id].game = game
    game.addPlayer(player)
    socket.emit('GAME_JOINED', { gameId: game.id })
    console.log('GAME_JOINED', state.games, Object.keys(state.sockets))
  })
})

httpServer.listen(5555, () => {
  console.log(`Express ready on ${5555}`)
})
