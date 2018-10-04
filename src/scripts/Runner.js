module.exports = class Runner {
  constructor() {
    this.lastTime = 0
    this.plugins = []

    this._tick = this._tick.bind(this)
  }

  add(plugin) {
    this.plugins.push(plugin)
  }

  _tick(timestamp) {
    if (this.lastTime) {
      let delta = Math.min(timestamp - this.lastTime, 17)
      this.update(delta)
    }

    this.lastTime = timestamp
    window.requestAnimationFrame(this._tick)
  }

  update(delta) {
    for (let i=0; i<this.plugins.length; i++) {
      this.plugins[i].update(delta);
    }
  }

  start() {
    this._tick()
  }
}