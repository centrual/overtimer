const Overtimer = require('./../../src/overtimer')

console.log('Starting timer...')

const t = new Overtimer(3000, {poll: 100, delay: 1000, debug: true, repeat: 10, start: false})

t.on('poll', function() {
  process.stdout.write("\u001b[0J\u001b[1J\u001b[2J\u001b[0;0H\u001b[0;0W")
  console.log(`Current Repeat Percent: ${t.currentRepeatPercent.toFixed(2)}`)
  console.log(`Current Repeat Percent With Delay: ${t.currentRepeatPercentWithDelay.toFixed(2)}`)
  console.log(`Total Percent: ${t.totalPercent.toFixed(2)}`)
  console.log(`Total Percent With Delay: ${t.totalPercentWithDelay.toFixed(2)}`)
})

t.start()
