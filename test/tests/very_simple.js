const Overtimer = require('./../../src/overtimer')

console.log('Starting timer...')

new Overtimer(5000, function () {
  console.log('Timer finished!')
})
