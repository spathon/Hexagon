const fs = require('fs')
const path = require('path')
const router = require('express').Router()
const { state } = require('../game')


const file = fs.readFileSync(path.resolve(__dirname, '../public/game.html'), 'utf8')


router.get('/', async (req, res) => {
  const html = file.replace('__GAME_ID__', '')
  res.send(html)
})

router.get('/game/:id', async (req, res) => {
  const html = file.replace('__GAME_ID__', req.params.id)
  res.send(html)
})


router.get('/state', (req, res) => (
  res.json({ games: state.games, sockets: Object.keys(state.sockets) })
))


module.exports = router
