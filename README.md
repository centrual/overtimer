# Overtimer
Performant javascript timer with extended features.

#### Install

You can install from npm or you can download direct source for direct browser use without webpack etc.
``` bash
npm i overtimer --save
```

Please check `test/tests` folder for examples.

#### Usage
``` javascript
  // All time values calculated in milliseconds
  const myTimer = new Overtimer(duration = 10000, {
    // Defaults
    delay: 0,
    repeat: 1,
    debug: false,
    start: true
  }, onFinishCallback = null)
  
  // Event name can be: start, tick, pause, resume, finish, stop, repeat, update, delaystart, delayend
  myTimer.on('Event name', function() { /* ... */ })
  myTimer.off('Event name', handlerFunction = null)
  
  // Public methods
  myTimer.start()
  myTimer.stop()
  myTimer.pause()
  myTimer.resume()
  myTimer.repeat()
  myTimer.endDelay()
  myTimer.tick()
  
  // Private methods ( Don't use this methods if you don't know what you doing )
  myTimer.joinToMainInterval()
  myTimer.tickMainInterval()
  myTimer.leaveFromMainInterval()
  myTimer.trigger(eventName, payload=[])
  
  // Variables can read
  myTimer.createdAt
  myTimer.startedAt
  myTimer.delayStartedAt
  myTimer.delayEndedAt
  myTimer.repeatedAt
  myTimer.tickedAt
  myTimer.stoppedAt
  myTimer.finishedAt
  myTimer.pausedAt
  myTimer.resumedAt
  
  myTimer.pausedTime
  myTimer.delayedTime
  myTimer.elapsedTime
  myTimer.remainingTime
  myTimer.totalDelayedTime
  myTimer.totalElapsedTime
  myTimer.totalRemainingTime
  myTimer.currentRepeat
  
  // Global Objects
  Overtimer.STATES = {
    CREATED: 0,
    WAITING: 1
    RUNNING: 2,
    PAUSED: 3,
    STOPPED: 4
  }
  
  Overtimer.global = {}
  
```
