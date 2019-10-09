const path = require('path')
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const app = express()
const httpServer = http.createServer(app)
const io = socketIo(httpServer)

app.use(express.static(path.join(__dirname, 'public')))

let players = []

io.on('connection', (socket) => {
  console.log('Connected:', socket.id)
  players.push(socket.id)
  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id)
    const filtered = players.filter(p => p !== socket.id)
    players = [...filtered]
  })
})

const server = httpServer.listen(5555, () => {
  console.log(`Express ready on ${5555}`)
})
