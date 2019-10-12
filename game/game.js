const generate = require('project-name-generator')
const state = require('./state')

// @todo max recursion
function generateGameId() {
  const gemaId = generate().dashed
  if (state.games[gemaId]) return generateGameId()
  return gemaId
}

class Game {
  constructor(player) {
    this.id = generateGameId()
    this.createdAt = Date.now()
    this.players = [player]
    console.log('Que?', this.players, player)
    state.games[this.id] = this
    state.sockets[player.id].game = this
  }

  removePlayer(playerId) {
    console.log('NOW')
    this.players = this.players.filter((player) => player.id !== playerId)
    if (this.players.length === 0) {
      delete state.games[this.id]
    }
  }

  addPlayer(player) {
    this.players.push(player)
  }
}

module.exports = Game
