const GRADIENT_COLOR_1 = '#00f260';
const GRADIENT_COLOR_2 = '#0575e6';
// const GRADIENT_COLOR_1 = '#1BFFFF';
// const GRADIENT_COLOR_2 = '#2E3192';
const GRADIENT_START_DEGREE = 135;

module.exports = class CoverGradientEffect {
  // effectTime in seconds
  constructor(effectTime=10) {
    this.degree = GRADIENT_START_DEGREE
    this.effectTime = effectTime

    this.domCover = document.getElementById('rp-cover')
    this.gradients = [
      `${GRADIENT_COLOR_1} 0%`,
      `${GRADIENT_COLOR_1} 10%`,
      `${GRADIENT_COLOR_2} 90%`,
      `${GRADIENT_COLOR_2} 100%`
    ].join(', ')
  }

  update(delta) {
    this.degree =  ( this.degree + (0.36 * delta)/this.effectTime) % 360
    this.domCover.style.backgroundImage = `linear-gradient(${this.degree}deg, ${this.gradients})`
  }
}