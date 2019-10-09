const path = require('path')
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const generate = require('project-name-generator')

const app = express()
const httpServer = http.createServer(app)
const io = socketIo(httpServer)

app.use(express.static(path.join(__dirname, 'public')))

let players = []
const games = {}

// @todo max recursion
function generateGameId() {
  const gemaId = generate().dashed
  if (games[gemaId]) return generateGameId()
  return gemaId
}


io.on('connection', (socket) => {
  console.log('Connected:', socket.id)
  players.push(socket.id)
  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id)
    const filtered = players.filter((p) => p !== socket.id)
    players = [...filtered]
  })

  socket.on('START_GAME', (msg) => {
    const gameId = generateGameId()
    games[gameId] = {
      createdAt: Date.now(),
      players: [{ id: socket.id, username: msg.username }],
    }
    console.log(games)
    return gameId
  })
})

httpServer.listen(5555, () => {
  console.log(`Express ready on ${5555}`)
})
