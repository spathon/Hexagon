class Player {
  constructor(id, username) {
    this.id = id
    this.username = username
    this.game = {}
  }

  setGame(game) {
    this.game = game
  }
}

module.exports = Player
