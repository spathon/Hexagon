import {
  Hexa, Point, Hex
} from './hex.js'


const canvas = document.getElementById('board')
const evtCanvas = document.getElementById('interactive')
const countDownEl = document.getElementById('countDown')
canvas.width = evtCanvas.width = window.innerWidth
canvas.height = evtCanvas.height = window.innerHeight

const evtCtx = evtCanvas.getContext('2d')
evtCtx.fillStyle = '#fff'
evtCtx.strokeStyle = 'rgba(255, 255, 255, 1)'
evtCtx.lineWidth = 2

const ctx = canvas.getContext('2d')
ctx.fillStyle = 'rgba(0, 0, 0, .5)'
ctx.strokeStyle = '#007bd2'
ctx.lineWidth = 1


// Fixed variables
const SIZE = 15
const SPACING = 4
const TOTAL_SIZE = SIZE + SPACING
const grid = []
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const HEX_WIDTH = TOTAL_SIZE * 2
const HEX_HEIGHT = Math.sqrt(3) * TOTAL_SIZE
const HEX_SPACING = HEX_WIDTH * 3/4
const ITEMS_WIDTH = WIDTH / HEX_SPACING + 1
const ITEMS_HEIGHT = HEIGHT / HEX_HEIGHT + 1
const COLORS = [
  { name: 'green', stroke: 'rgba(11, 255, 1, 1)', shadow: 'rgba(11, 255, 1, .5)' },
  // { name: 'blue', stroke: 'rgb(1,30,254)', shadow: 'rgba(1,30,254, .5)' }, // Nah
  // { name: 'lightblue', stroke: 'rgb(0, 145, 228)', shadow: 'rgba(0, 145, 228, .5)' }, // Ok but ligher blur better
  { name: 'pink', stroke: 'rgb(254,0,246)', shadow: 'rgba(254,0,246, .5)' },
  { name: 'yellow', stroke: 'rgb(253,254,2)', shadow: 'rgba(253,254,2, .3)' },
  { name: 'brigh-turquoise', stroke: 'rgb(12, 252, 211)', shadow: 'rgba(12, 252, 211, .8)' },
  { stroke: 'rgb(254, 83, 188)', shadow: 'rgba(254, 83, 188, .8)' }, // Pink
  { stroke: 'rgb(184, 108, 253)', shadow: 'rgba(184, 108, 253, 1)' }, // Purple
  { stroke: 'rgb(118, 213, 253)', shadow: 'rgba(118, 213, 253, .8)' }, // Ligher blue Save
  { stroke: 'rgb(252, 107, 104)', shadow: 'rgba(252, 107, 104, .4)' }, // Red
  { stroke: 'rgba(255, 170, 1, 1.00)', shadow: 'rgba(255, 170, 1, 1.00)' }, // Orange
  // { stroke: 'rgba(0, 0, 0, 1.00)', shadow: 'rgba(0, 0, 0, 1.00)' }, // Black SILENT KILLER
  { stroke: 'rgba(255, 255, 255, 1.00)', shadow: 'rgba(255, 255, 255, .6)' }, // White
]
const directions = {
  0: { hitPos: 'right', up: 0, left: 1, down: 1, right: 0, next: { 0: 60, 1: 300 } },
  60: { hitPos: 'right-bottom', up: 0, left: 1, down: 1, right: 0, next: { 0: 120, 1: 0 } },
  120: { hitPos: 'left-bottom', up: 1, left: 1, down: 0, right: 0, next: { 0: 180, 1: 60 } },
  180: { hitPos: 'left', up: 1, left: 1, down: 0, right: 0, next: { 0: 240, 1: 120 } },
  240: { hitPos: 'left-top', up: 1, left: 0, down: 0, right: 1, next: { 0: 300, 1: 180 } },
  300: { hitPos: 'right-top', up: 0, left: 0, down: 1, right: 1, next: { 0: 0, 1: 240 } },
}


// state variables
let currentColor
let timeOutId




const hexa = new Hexa({ size: SIZE, spacing: SPACING })

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function inRange(x, min, max) {
  return ((x-min)*(x-max) <= 0)
}

function draw(cube, color) {
  const center = hexa.flatHexToPixel(cube)
  const corners = hexa.getCorners(center)
  ctx.beginPath()
  ctx.moveTo(corners[0].x, corners[0].y)

  for (let i = 1; i < corners.length; i++) {
    ctx.lineTo(corners[i].x, corners[i].y)
  }

  ctx.closePath()
  ctx.stroke()
  if (color) ctx.fillStyle = color
  ctx.fill()
}


for (let iY = 0; iY < ITEMS_HEIGHT; iY++) {
  for (let iX = 0; iX < ITEMS_WIDTH; iX++) {
    const cube = hexa.oddqToCube(new Point(iX, iY))
    grid.push(cube)
    draw(cube)
  }
}


const player = {
  initPos: {},
  direction: null,
  prevDirection: null
}

function getDirection(value) {
  if (value > 0) return -1
  if (value < 0) return 1
  return 0
}


function startGame() {
  currentColor = COLORS[randomBetween(0, COLORS.length - 1)]
  const center = hexa.flatHexToPixel(player.initPos)
  const corners = hexa.getCorners(center, TOTAL_SIZE)
  const randomNum = randomBetween(0, 5)
  const corner = corners[randomNum]
  const nextCorner = randomNum === 5 ? corners[0] : corners[randomNum + 1]
  player.from = corner
  player.to = nextCorner
  player.amount = 0
  player.directionX = getDirection(corner.x - nextCorner.x)
  player.directionY = getDirection(corner.y - nextCorner.y)

  evtCtx.beginPath()
  evtCtx.moveTo(corner.x, corner.y)
  drawCircle(corner)
  evtCtx.moveTo(corner.x, corner.y)
  clearTimeout(timeOutId)
  animate()
}


function animate() {
  player.amount += 0.1
  const x = player.from.x + (player.to.x - player.from.x) * player.amount
  const y = player.from.y + (player.to.y - player.from.y) * player.amount
  evtCtx.lineTo(x, y)
  evtCtx.strokeStyle = 'rgba(255, 255, 255, 1)'
  evtCtx.lineWidth = 1
  evtCtx.shadowBlur = 5
  evtCtx.shadowColor = 'rgba(255, 255, 255, .3)'

  evtCtx.strokeStyle = currentColor.stroke
  evtCtx.shadowColor = currentColor.shadow
  evtCtx.stroke()

  if (inRange(x, player.to.x - 0.1, player.to.x + 0.1)) {
    evtCtx.beginPath()
    evtCtx.moveTo(x, y)
    const hex = hexa.pixelToFlatHex(new Point(x + player.directionX, y + player.directionY))
    const center = hexa.flatHexToPixel(hex)
    const corners = hexa.getCorners(center, TOTAL_SIZE)
    const outOfBounds = corners.find(c => c.y < 0 || c.y > HEIGHT || c.x < 0 || c.x > WIDTH)
    const endCorner = corners.findIndex(c => inRange(c.x, x - 1, x + 1) && inRange(c.y, y - 1, y + 1))
    // console.log('DONE', x, y, 'NEW', hex, 'CORNERS', corners, 'END', endCorner)
    player.from = corners[endCorner]
    if (!player.from) {
      console.log('NOPE', corners, endCorner)
    }
    // console.log(player.from.degree, directions[player.from.degree], player.direction, directions[player.from.degree][player.direction])
    const nextDirection = player.direction !== null
      ? directions[player.from.degree][player.direction]
      : (outOfBounds) ? 1 : randomBetween(0, 1)
    if (nextDirection) {
      player.to = endCorner === 5 ? corners[0] : corners[endCorner + 1]
    } else {
      player.to = endCorner === 0 ? corners[5] : corners[endCorner - 1]
    }
    // console.log('DIR', nextDirection, 'Degree', player.from.degree)
    player.prevDirection = nextDirection
    player.direction = null
    player.amount = 0
    player.directionX = getDirection(player.from.x - player.to.x)
    player.directionY = getDirection(player.from.y - player.to.y)
    draw(hex, 'rgba(221, 61, 54, .5)')
    // drawCircle(corners[endCorner])
    animate()
  } else {
    timeOutId = setTimeout(() => animate(), 100)
  }
}


function drawCircle(corner) {
  const radius = 2
  evtCtx.beginPath()
  evtCtx.arc(corner.x, corner.y, radius, 0, 2 * Math.PI)
  evtCtx.fillStyle = currentColor.stroke
  evtCtx.stroke()
  evtCtx.fill()
  evtCtx.beginPath()
}

function drawLine(from, to) {
  evtCtx.beginPath()
  evtCtx.moveTo(from.x, from.y)
  evtCtx.lineTo(to.x, to.y)
  evtCtx.strokeStyle = 'rgba(255, 255, 255, 1)'
  evtCtx.lineWidth = 2
  evtCtx.shadowBlur = 3
  evtCtx.shadowColor = '#fff'
  evtCtx.stroke()
}


function initDelay(delay) {
  if (delay <= 0) {
    countDownEl.textContent = ''
    return startGame()
  }
  countDownEl.textContent = delay
  setTimeout(() => initDelay(--delay), 700)
}

function start() {
  // const startX = randomBetween(40, WIDTH - 40)
  // const startY = randomBetween(40, HEIGHT - 40)
  // const hex = hexa.pixelToFlatHex(new Point(startX, startY))
  // player.initPos = hex
  // draw(hex, '#119')

  initDelay(3)
}

evtCanvas.addEventListener('click', (evt) => {
  const offsetX = evt.pageX
  const offsetY = evt.pageY
  const hex = hexa.pixelToFlatHex(new Point(offsetX, offsetY))
  player.initPos = hex
  draw(hex, '#191')
  start()
})

const nextDirection = document.getElementById('nextDirection')
// Left 37 - Up 38 - Right 39 - Down 40
const arrows = {
  37: { key: 'left', value: 0 },
  38: { key: 'up', value: 1 },
  39: { key: 'right', value: 1 },
  40: { key: 'down', value: 0 },
}
document.addEventListener('keydown', (evt) => {
  if (arrows[evt.keyCode]) {
    const { key } = arrows[evt.keyCode]
    const nextCorner = directions[player.from.degree].next[player.prevDirection]
    const nextOptionsDir = directions[nextCorner][key]
    const nextDirectionDegree = directions[nextCorner].next[nextOptionsDir]
    nextDirection.style.transform = `rotate(${nextDirectionDegree - 180}deg)`
    player.direction = key
  }
})

const playPause = document.getElementById('pausePlay')
playPause.addEventListener('click', () => {
  if (timeOutId) {
    playPause.textContent = '▶'
    clearTimeout(timeOutId)
    timeOutId = null
  } else {
    playPause.textContent = '■'
    animate()
  }
})
