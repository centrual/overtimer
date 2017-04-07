const Overtimer = require('./../../src/overtimer')

const timer1 = new Overtimer(1000, {debug: true, repeat: Infinity})
let updatedFor = 0

timer1.on('start', function() {
  console.log('Timer1 started!')
})

timer1.on('tick', function() {
  console.log(`Timer1 tick! Updated ${updatedFor} times.`)
})

timer1.on('stop', function() {
  console.log(`Timer1 stopped! Updated ${updatedFor} before stop.`)
})

timer1.on('repeat', function() {
  console.log(`Repeated at ${updatedFor}!`)
})

timer1.on('update', () => {
  updatedFor += 1
})

console.log('Starting timer...')

setTimeout(() => {
  timer1.stop()
}, 4500)
