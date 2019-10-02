

export function Point(x, y, degree) {
  this.x = x
  this.y = y
  this.degree = degree
}


export class Hex {
  constructor(q, r, s) {
    if (Math.round(q + r + s) !== 0) throw 'q + r + s must be 0'
    this.q = q
    this.r = r
    this.s = s
  }
}
Hex.directions = [new Hex(1, 0, -1), new Hex(1, -1, 0), new Hex(0, -1, 1), new Hex(-1, 0, 1), new Hex(-1, 1, 0), new Hex(0, 1, -1)]



export class Hexa {
  constructor(config = {}) {
    this.SIZE = config.size || 20
    this.SPACING = config.spacing || 3
    this.TOTAL_SIZE = this.SIZE + this.SPACING
  }

  oddqToCube(point) {
    const q = point.x
    const r = point.y - (point.x - (point.x & 1)) / 2
    const s = -q - r
    return new Hex(q, r, s)
  }

  flatHexToPixel(hex) {
    const x = this.TOTAL_SIZE * (3/2 * hex.q)
    const y = this.TOTAL_SIZE * (Math.sqrt(3)/2 * hex.q  +  Math.sqrt(3) * hex.r)
    return new Point(x, y)
  }

  cubeRound(hex) {
    let qi = Math.round(hex.q)
    let ri = Math.round(hex.r)
    let si = Math.round(hex.s)
    const q_diff = Math.abs(qi - hex.q)
    const r_diff = Math.abs(ri - hex.r)
    const s_diff = Math.abs(si - hex.s)

    if (q_diff > r_diff && q_diff > s_diff) {
      qi = -ri - si
    } else if (r_diff > s_diff) {
      ri = -qi - si
    } else {
      si = -qi - ri
    }
    return new Hex(qi, ri, si)
  }

  pixelToFlatHex(point) {
    const q = (2/3 * point.x) / this.TOTAL_SIZE
    const r = (-1/3 * point.x + Math.sqrt(3)/3 * point.y) / this.TOTAL_SIZE
    return this.hexRound(q, r)
  }

  hexRound(q, r) {
    const hex = new Hex(q, r, -q - r)
    return this.cubeRound(hex)
  }

  getCorners(center, size = this.SIZE) {
    const points = []
    for (let i = 0; i < 6; i++) {
      const degree = 60 * i
      const radian = Math.PI / 180 * degree

      const point = new Point(
        center.x + size * Math.cos(radian),
        center.y + size * Math.sin(radian),
        degree
      )
      points.push(point)
    }
    return points
  }

}
