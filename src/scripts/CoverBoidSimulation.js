const Boids = require('boids')
const Fps = require('fps')
const debounce = require('debounce')
const logger = require('./logger')

const BOID_MAX_HISTORY = 0
const BOID_INITIAL_AMOUNT = 10
const BOID_MAX_AMOUNT = 150
const BOID_MIN_AMOUNT = 5
const BOID_SIZE = 2
const BOID_MAX_SIZE = 5
const BOID_MIN_SIZE = 2
const CANVAS_WIDTH = 1920
const CANVAS_BORDER = 100

module.exports = class CoverBoidSimulation {
  constructor() {
    this.maxAmount = BOID_MAX_AMOUNT
    this.mouseAttractor = [Infinity, Infinity, 100, -1]
    this.fpsCounter = Fps({ every: 10, decay: 0.05 })
    this.offset = { x: 0, y: 0 }
    this.flock = Boids({
      boids: BOID_INITIAL_AMOUNT,
      speedLimit: 0.5,
      accelerationLimit: 0.5,
      alignmentForce: 0.35,
      attractors: [
        [-125, 0, 100, -0.5],
        [-45, 0, 100, -0.5],
        [45, 0, 100, -0.5],
        [125, 0, 100, -0.5],
        this.mouseAttractor
      ]
    })

    for (let i = 0; i < BOID_INITIAL_AMOUNT; i++) {
      this.flock.boids[i].push(0)
      this.flock.boids[i].push(Math.random() * BOID_MAX_SIZE + BOID_MIN_SIZE)
    }

    this.history = []

    this.domCanvas = document.getElementById('rp-cover-canvas')
    this.ctx = this.domCanvas.getContext('2d')

    this.onMouseMove = this.onMouseMove.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)
    this.onFpsCounter = this.onFpsCounter.bind(this)

    document.body.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('resize', debounce(() => this.onWindowResize(), 10))
    this.fpsCounter.on('data', this.onFpsCounter)

    this.onWindowResize()
  }

  _drawSingle(x, y, size, alpha) {
    let width = this.domCanvas.width;
    let height = this.domCanvas.height;

    if (x < CANVAS_BORDER || y < CANVAS_BORDER) {
      alpha = Math.min(Math.min(x / CANVAS_BORDER, y / CANVAS_BORDER), alpha)

    } else if (x > (width - CANVAS_BORDER) || y > (height - CANVAS_BORDER)) {
      alpha = Math.min(Math.min((width - x) / CANVAS_BORDER, (height - y) / CANVAS_BORDER), alpha)
    }

    this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
    this.ctx.beginPath()
    this.ctx.arc(x, y, size, 0, 360)
    this.ctx.fill()
  }

  _drawHistory(delta) {
    let width = this.domCanvas.width
    let height = this.domCanvas.height
    let halfWidth = width / 2
    let halfHeight = height / 2
    let length = this.history.length

    for (let i = 0; i < length; i++) {
      for (let j = 0; j < this.history[i].length; j++) {
        let boid = this.history[i][j]
        let alpha = boid[2] / (length - i)
        let size = boid[3]
        this._drawSingle(boid[0] + halfWidth, boid[1] + halfHeight, size, alpha)
      }
    }
  }

  _drawCurrent(delta) {
    let width = this.domCanvas.width
    let height = this.domCanvas.height
    let halfWidth = width / 2
    let halfHeight = height / 2
    let boidData = this.flock.boids

    let history = []
    for (let i = 0, l = boidData.length, x, y; i < l; i++) {
      let data = boidData[i]
      let x = data[0]
      let y = data[1]
      let alpha = data[6]
      let size = data[7]

      if (alpha < 1) {
        alpha += delta / 1000
      }
      data[0] = x > halfWidth ? -halfWidth : -x > halfWidth ? halfWidth : x
      data[1] = y > halfHeight ? -halfHeight : -y > halfHeight ? halfHeight : y
      data[6] = alpha

      this._drawSingle(x + halfWidth, y + halfHeight, size, alpha)
      history.push([x, y, alpha, size])
    }

    this.history.push(history)
  }

  _drawAttractors(delta) {
    let width = this.domCanvas.width
    let height = this.domCanvas.height
    let halfWidth = width / 2
    let halfHeight = height / 2

    for (let i = 0; i < this.flock.attractors.length; i++) {
      let attr = this.flock.attractors[i]

      if (attr[4] > 0) {
        this.ctx.fillStyle = `rgba(0, 255, 0, .5)`
      } else {
        this.ctx.fillStyle = `rgba(255, 0, 0, .5)`
      }
      this.ctx.beginPath()
      this.ctx.arc(attr[0] + halfWidth, attr[1] + halfHeight, attr[2], 0, 360)
      this.ctx.fill()
    }
  }

  _pruneHistory() {
    if (this.history.length > BOID_MAX_HISTORY) {
      this.history.shift()
    }
  }

  update(delta) {
    this.fpsCounter.tick()
    this.flock.tick()

    let width = this.domCanvas.width
    let height = this.domCanvas.height
    this.ctx.clearRect(0, 0, width, height)
    this._drawHistory(delta)
    this._drawCurrent(delta)
    // this._drawAttractors(delta)
    this._pruneHistory()
    this.ctx.restore()
  }

  onMouseMove(evt) {
    let halfHeight = this.domCanvas.height / 2
    let halfWidth = this.domCanvas.width / 2

    this.mouseAttractor[0] = evt.x - halfWidth - this.offset.x
    this.mouseAttractor[1] = evt.y - halfHeight - this.offset.y
  }

  onWindowResize() {
    this.domCanvas.width = Math.min(window.innerWidth - 40, CANVAS_WIDTH)
    this.domCanvas.height = window.innerHeight - 20

    setTimeout(() => {
      let rect = this.domCanvas.getBoundingClientRect()
      this.offset.x = rect.left
      this.offset.y = rect.top
    }, 25)
  }

  onFpsCounter(fps) {
    let width = this.domCanvas.width
    let height = this.domCanvas.height
    let halfWidth = width / 2
    let halfHeight = height / 2

    for (let i = 0; i < 3; i++) {
      if (fps <= 56 && this.flock.boids.length > BOID_MIN_AMOUNT) {
        this.flock.boids.pop()
        // this.maxAmount -= 3

      } else if (fps >= 60 && this.flock.boids.length < this.maxAmount) {
        this.flock.boids.push([
          Math.random() * width - halfWidth,
          Math.random() * height - halfHeight,
          Math.random() * 6.28 - 3.14,
          Math.random() * 6.28 - 3.14,
          0,
          0,
          0,
          Math.random() * BOID_MAX_SIZE + BOID_MIN_SIZE
        ])
      }
    }
  }
}