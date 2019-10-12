/* global io, GAME_ID */
const socket = io()


const startForm = document.getElementById('startGameForm')
const usernameInput = document.getElementById('username')

startForm.addEventListener('submit', (evt) => {
  evt.preventDefault()
  if (GAME_ID) {
    socket.emit('JOIN_GAME', { username: usernameInput.value, gameId: GAME_ID })
  } else {
    socket.emit('START_GAME', { username: usernameInput.value })
  }
})


socket.on('GAME_CREATED', (msg) => {
  window.history.pushState({}, `Game ${msg.gameId} initiated`, `/game/${msg.gameId}`)
  startForm.remove()
})


socket.on('GAME_JOINED', () => {
  console.log('Let the games begin!')
  startForm.remove()
})
