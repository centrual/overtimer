const Overtimer = require('./../../src/overtimer')

console.log('Starting timer...')

const myTimer = new Overtimer(10000, {debug: true, overtimeLimit: 9000, poll: 1000, overtimeBump: 4000, start: false})

myTimer.on('bump', function (bumpMs, remaining) {
  console.log(`Timer bumped for ${bumpMs}. Remaining time: ${remaining}`)
})

myTimer.on('finish', function () {
  console.log(`Timer finished!`)
  console.log(myTimer)
})

myTimer.on('stop', function () {
  console.log(`Timer stopped.`)
})

myTimer.on('poll', function () {
  console.log(`Remaining Time: ${myTimer.remainingTime}`)
})

myTimer.start()

setTimeout(() => {
  myTimer.bump() // Must bump ~ 200, Remaining time must become: 9000
}, 1200)

setTimeout(() => {
  myTimer.bump(100000) // Must bump ~ 6800, Remaining time must become: 9000
}, 8000)

setTimeout(() => {
  myTimer.bump(3000) // Must bump 3000, Remaining time must become: ~8000
}, 12000)

setTimeout(() => {
  myTimer.bump() // Must bump 4000, Remaining time must become: ~6000
}, 18000)

setTimeout(() => {
  myTimer.bump() // Must return false, because of timer stopped.
}, 26000)
