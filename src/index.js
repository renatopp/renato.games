const Runner = require('./scripts/Runner')
const CoverGradientEffect = require('./scripts/CoverGradientEffect')
// const CoverBoidSimulation = require('./scripts/CoverBoidSimulation')

let started = false
function main() {
  if (started) return

  started = true
  let runner = new Runner()

  runner.add(new CoverGradientEffect(120))
  // runner.add(new CoverBoidSimulation())

  runner.start()
}

document.addEventListener('DOMContentLoaded', main, false)
window.addEventListener('load', main, false)
