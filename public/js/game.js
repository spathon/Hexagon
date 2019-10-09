
const socket = io()


const startForm = document.getElementById('startGameForm')
const usernameInput = document.getElementById('username')

startForm.addEventListener('submit', (evt) => {
  evt.preventDefault()
  socket.emit('START_GAME', { username: usernameInput.value })
})
