---

![Overtimer logo](docs/assets/img/logo.png "overtimer logo")

---

Javascript timer with extended features. Control is yours now!

#### Install

You can download files as zip or you can use

``` bash
npm install overtimer --save
bower install overtimer --save
yarn add overtimer
```

Please check `test/tests` folder for examples.

#### Usage
``` javascript
  // All time values calculated in milliseconds
  const myTimer = new Overtimer(duration = 10000, {
    // Defaults
    poll: 100,
    delay: 0,
    repeat: 1,
    debug: false,
    start: true,
    
    overtimeLimit: duration,
    overtimeBump: duration
  }, onFinishCallback)
  
  // Event name can be: start, tick, pause, resume, finish, stop, repeat, update, delaystart, delayend, bump, poll
  myTimer.on('Event name', function() { /* ... */ })
  myTimer.off('Event name', handlerFunction = null)
  
  // Public methods
  myTimer.start()
  myTimer.stop()
  myTimer.pause()
  myTimer.resume()
  myTimer.repeat()
  myTimer.bump(customValue = -1)
  myTimer.endDelay()
  myTimer.tick()
  
  // Private methods ( Don't use this methods if you don't know what you doing )
  myTimer.joinToMainInterval()
  myTimer.tickMainInterval()
  myTimer.leaveFromMainInterval()
  myTimer.trigger(eventName, ...payload)
  
  // Variables can read
  myTimer.state = Overtimer.STATES.CREATED
  
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
  myTimer.bumpedAt
  myTimer.lastPollAt
  
  myTimer.pausedTime
  myTimer.delayedTime
  myTimer.elapsedTime
  myTimer.overTime
  myTimer.remainingTime
  myTimer.totalDelayedTime
  myTimer.totalElapsedTime
  myTimer.totalRemainingTime
  myTimer.currentRepeat
  
  myTimer.repeatDuration
  myTimer.repeatDurationWithDelay
  myTimer.totalDuration
  myTimer.totalDurationWithDelay
  
  myTimer.currentRepeatPercentWithDelay
  myTimer.currentRepeatPercent
  myTimer.totalPercentWithDelay
  myTimer.totalPercent
  
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
