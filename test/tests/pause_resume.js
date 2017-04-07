const Overtimer = require('./../../src/overtimer')

const myTimer = new Overtimer(10000, {debug: true})
let pausedBefore = false

myTimer.on('stop', function() {
  console.log(`Timer1 stopped!`)
})

myTimer.on('update', () => {
  if( !pausedBefore && myTimer.elapsedTime >= 3000 ) {
    myTimer.pause()
    pausedBefore = true
    
    setTimeout(() => {
      myTimer.resume()
    }, 3000)
  }
})

myTimer.on('finish', function() {
  console.log('Timer finished!')
  console.log(`Elapsed: ${myTimer.elapsedTime} ms`)
  console.log(`Paused: ${myTimer.pausedTime} ms`)
  console.log(`Total elapsed time: ${myTimer.elapsedTime + myTimer.pausedTime} ms`)
})

console.log('Starting timer...')
