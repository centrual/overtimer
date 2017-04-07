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
    repeat: 1,
    debug: false,
    start: true
  })
  
  myTimer.on('start', function() { /* ... */ })
  myTimer.on('tick', function() { /* ... */ })
  myTimer.on('stop', function() { /* ... */ })
  myTimer.on('repeat', function() { /* ... */ })
  myTimer.on('update', function() { /* ... */ })
  
  myTimer.off('start|tick|stop|repeat|update', handlerFunction = null)
  
  // Public methods
  myTimer.start()
  myTimer.stop()
  myTimer.repeat()
  myTimer.tick()
  
  // Private methods ( Don't use this methods if you don't know what you doing )
  myTimer.joinToMainInterval()
  myTimer.tickMainInterval()
  myTimer.leaveFromMainInterval()
  myTimer.trigger(eventName, payload=[])
  
  // Global Objects
  Overtimer.STATES = {
    CREATED: 0,
    RUNNING: 1,
    PAUSED: 2, // I will add soon
    STOPPED: 3
  }
  
  Overtimer.global = {}
  
```
