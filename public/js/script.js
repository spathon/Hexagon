import {
  Hexa, Point,
} from '../hex.js'

const gameEl = document.getElementById('game')

// Fixed variables
const SIZE = 15
const SPACING = 4
const TOTAL_SIZE = SIZE + SPACING
const grid = []
const WIDTH = gameEl.offsetWidth - 2
const HEIGHT = gameEl.offsetHeight - 2
const HEX_WIDTH = TOTAL_SIZE * 2
const HEX_HEIGHT = Math.sqrt(3) * TOTAL_SIZE
const HEX_SPACING = HEX_WIDTH * (3 / 4)
const ITEMS_WIDTH = WIDTH / HEX_SPACING + 1
const ITEMS_HEIGHT = HEIGHT / HEX_HEIGHT + 1


const canvas = document.getElementById('background')
canvas.height = HEIGHT
canvas.width = WIDTH
const ctx = canvas.getContext('2d')
ctx.fillStyle = 'rgba(0, 0, 0, .5)'
ctx.strokeStyle = '#007bd2'
ctx.lineWidth = 1


const hexa = new Hexa({ size: SIZE, spacing: SPACING })

function draw(cube, color) {
  const center = hexa.flatHexToPixel(cube)
  const corners = hexa.getCorners(center)
  ctx.beginPath()
  ctx.moveTo(corners[0].x, corners[0].y)

  for (let i = 1; i < corners.length; i += 1) {
    ctx.lineTo(corners[i].x, corners[i].y)
  }

  ctx.closePath()
  ctx.stroke()
  if (color) ctx.fillStyle = color
  ctx.fill()
}


for (let iY = 0; iY < ITEMS_HEIGHT; iY += 1) {
  for (let iX = 0; iX < ITEMS_WIDTH; iX += 1) {
    const cube = Hexa.oddqToCube(new Point(iX, iY))
    grid.push(cube)
    draw(cube)
  }
}
