const Overtimer = require('./../../src/overtimer')

console.log('Starting timer...')

const myTimer = new Overtimer(1000, {debug: true, delay: 1000, repeat: 3, start: false})

myTimer.on('start', function () {
  console.log('Timer1 started!')
})

myTimer.on('tick', function () {
  console.log(`TICK!`)
})

myTimer.on('finish', function () {
  console.log(`Timer finished!`)
  console.log(myTimer)
})

myTimer.on('delaystart', function () {
  console.log(`Delay start!`)
})

myTimer.on('delayend', function () {
  console.log(`Delay end!`)
})

myTimer.on('stop', function () {
  console.log(`Timer stopped.`)
})

myTimer.on('repeat', function () {
  if( myTimer.currentRepeat === 2 ) {
    myTimer.pause()
    
    setTimeout(() => {
      myTimer.resume()
    }, 3000)
  }
  
  console.log(`${myTimer.currentRepeat}. Repeat!`)
})

myTimer.start()
