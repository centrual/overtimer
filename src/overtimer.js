/**
 * Enum for Overtimer states.
 * @type {{CREATED: number, WAITING: number, RUNNING: number, PAUSED: number, STOPPED: number}}
 */
Overtimer.STATES = {
  CREATED: 0,
  WAITING: 1,
  RUNNING: 2,
  PAUSED: 3,
  STOPPED: 4
}

/**
 * Global timer object for performance.
 */
Overtimer.global = {
  callbacks: [],
  timer: null,
  updateMs: 1,
  lastId: 0,
  
  /**
   * Joins the global timer list
   * @param callback {function} Callback function will trigger ~ every ms
   * @return {Number} Unique timer id for leave.
   */
  join(callback) {
    let found = Overtimer.global.callbacks.find(f => f.callback === callback)
    
    if (typeof found === 'undefined') {
      Overtimer.global.lastId += 1
      Overtimer.global.callbacks.push({callback, id: Overtimer.global.lastId})
    } else {
      return found.id
    }
    
    if (Overtimer.global.timer === null)
      Overtimer.global.timer = setInterval(Overtimer.global.tick, Overtimer.global.updateMs)
    
    return Overtimer.global.lastId
  },
  
  /**
   * Leaves from global timer list
   * @param id {number} Auto generated id from join for leave.
   */
  leave(id) {
    Overtimer.global.callbacks = Overtimer.global.callbacks.filter(c => c.id !== id)
    
    if (Overtimer.global.callbacks.length === 0 && Overtimer.global.timer !== null) {
      clearInterval(Overtimer.global.timer)
      Overtimer.global.timer = null
    }
  },
  
  /**
   * Callback trigger function for every ms
   */
  tick() {
    Overtimer.global.callbacks.forEach((cb) => {
      cb.callback()
    })
  }
}

/**
 * Overtimer constructor.
 * @param duration {Number} Duration of timer
 * @param opts {Object} Overtimer options
 * @param onFinish {Function} Shorthand for on('finish')
 * @constructor
 */
function Overtimer(duration = 1000, opts = {}, onFinish = null) {
  let finishEvent = null
  let defaults = {
    duration,
    overtimeLimit: duration,
    overtimeBump: duration,
    
    poll: 100,
    delay: 0,
    repeat: 1,
    debug: false,
    start: true,
  }
  
  this.eventHandlers = {
    'start': [],
    'tick': [],
    'stop': [],
    'pause': [],
    'resume': [],
    'delaystart': [],
    'delayend': [],
    'bump': [],
    'repeat': [],
    'finish': [],
    'update': [],
    'poll': []
  }
  
  if (typeof opts === 'object') {
    this.options = Object.assign({}, defaults, opts)
  } else {
    if (typeof opts === 'function') {
      finishEvent = opts
    }
    this.options = Object.assign({}, defaults)
  }
  
  if (typeof onFinish === 'function')
    finishEvent = onFinish
  
  let durationError = false
  
  if (typeof duration !== 'number') {
    this.log('Duration must be number value.', 1000)
    durationError = true
  } else if (duration <= 0) {
    this.log('Duration must be bigger than 0.', 1001)
    durationError = true
  }
  
  if( durationError ) {
    this.options.duration = 1000
    this.options.overtimeLimit = 1000
    this.options.overtimeBump = 1000
  }
  
  // Properties
  this.version = '0.1.6'
  this.globalTimerId = null
  this.state = Overtimer.STATES.CREATED
  
  this.createdAt = Date.now()
  this.startedAt = -1
  this.delayStartedAt = -1
  this.delayEndedAt = -1
  this.repeatedAt = -1
  this.tickedAt = -1
  this.stoppedAt = -1
  this.finishedAt = -1
  this.pausedAt = -1
  this.resumedAt = -1
  this.bumpedAt = -1
  
  this.pausedTime = -1
  this.delayedTime = -1
  this.overTime = -1
  this.elapsedTime = -1
  this.remainingTime = -1
  this.totalDelayedTime = -1
  this.totalElapsedTime = -1
  this.totalRemainingTime = -1
  this.currentRepeat = -1
  
  this.repeatDuration = -1
  this.repeatDurationWithDelay = -1
  this.totalDuration = -1
  this.totalDurationWithDelay = -1
  
  this.currentRepeatPercentWithDelay = -1
  this.currentRepeatPercent = -1
  this.totalPercentWithDelay = -1
  this.totalPercent = -1
  
  this.timesUpdatedAt = -1
  this.lastPollAt = -1
  
  if (typeof finishEvent === 'function')
    this.on('finish', finishEvent)
  
  if (this.options.start)
    this.start()
}

/**
 * Logs errors if debug enabled
 * @param msg {String} Message will be displayed
 * @param code {Number} Code will be displayed
 */
Overtimer.prototype.log = function (msg = 'Unexcepted error.', code = -1) {
  if (this.options.debug)
    console.log(`${code !== -1 ? '( ' + code.toString() + ' ): ' : ''} ${msg}`)
}

/**
 * Registers callback to event.
 * @param eventName {String} Selected event name from available events.
 * @param callback {Function} Function to be triggered when the event occurs.
 * @return {Boolean} true if succeeded, false if not.
 */
Overtimer.prototype.on = function (eventName, callback) {
  if (typeof eventName !== 'string') {
    this.log('Event name must be string.', 1002)
    return false
  } else if (eventName.length < 1) {
    this.log('Event name length be bigger than 0.', 1003)
    return false
  } else if (typeof this.eventHandlers[eventName] === 'undefined') {
    this.log('Event name not registered!', 1004)
    return false
  } else if (typeof callback !== 'function') {
    this.log('Callback is not function!', 1005)
    return false
  }
  
  this.eventHandlers[eventName].push(callback)
  return true
}

/**
 * Removes all callbacks or spesific function from event
 * @param eventName {String} Selected event name from available events.
 * @param func {Function} Function to be removed.
 * @return {boolean} true if succeeded, false if not.
 */
Overtimer.prototype.off = function (eventName, func = null) {
  if (typeof eventName !== 'string') {
    this.log('Event name must be string.', 1006)
    return false
  } else if (eventName.length < 1) {
    this.log('Event name length be bigger than 0.', 1007)
    return false
  } else if (typeof this.eventHandlers[eventName] === 'undefined') {
    this.log('Event name not registered!', 1008)
    return false
  }
  
  if (typeof func === 'function')
    this.eventHandlers[eventName] = this.eventHandlers[eventName].filter(f => f !== func)
  else
    this.eventHandlers[eventName] = []
  
  return true
}

/**
 * Triggers registered event
 * @param eventName {string} Event name you want to trigger
 * @param payload {object} payload for trigger. can be array, or can be object
 * @return {boolean} Returns true if succeeded, false if not
 */
Overtimer.prototype.trigger = function (eventName, ...payload) {
  if (typeof eventName !== 'string') {
    this.log('Event name must be string.', 1009)
    return false
  } else if (eventName.length < 1) {
    this.log("Event name's length must bigger than 1.", 1010)
    return false
  } else if (typeof this.eventHandlers[eventName.toLowerCase()] === 'undefined' || !Array.isArray(this.eventHandlers[eventName.toLowerCase()])) {
    this.log('Event not found in list.', 1011)
    return false
  }
  
  this.eventHandlers[eventName.toLowerCase()].forEach((evt) => {
    evt.call(this, ...payload)
  })
  
  return true
}

/**
 * Joins main interval for updates.
 */
Overtimer.prototype.joinToMainInterval = function () {
  this.globalTimerId = Overtimer.global.join(this.tickMainInterval.bind(this))
}

/**
 * All time updates happens in this function.
 */
Overtimer.prototype.tickMainInterval = function () {
  let now = Date.now(),
    diff = now - this.timesUpdatedAt
  
  if (this.state === Overtimer.STATES.RUNNING) {
    this.elapsedTime += diff
    this.remainingTime -= diff
    this.totalElapsedTime += diff
    this.totalRemainingTime -= diff
  
    this.currentRepeatPercentWithDelay = parseFloat((this.elapsedTime + this.delayedTime) / this.repeatDurationWithDelay * 100)
    this.totalPercentWithDelay = parseFloat((this.totalElapsedTime + this.totalDelayedTime) / this.totalDurationWithDelay * 100)
    this.currentRepeatPercent = parseFloat(this.elapsedTime / this.repeatDuration * 100)
    this.totalPercent = parseFloat(this.totalElapsedTime / this.totalDuration * 100)
  } else if (this.state === Overtimer.STATES.PAUSED) {
    this.pausedTime += diff
  } else if (this.state === Overtimer.STATES.WAITING) {
    this.delayedTime += diff
    this.totalDelayedTime += diff
  
    this.currentRepeatPercentWithDelay = parseFloat((this.elapsedTime + this.delayedTime) / this.repeatDurationWithDelay * 100)
    this.totalPercentWithDelay = parseFloat((this.totalElapsedTime + this.totalDelayedTime) / this.totalDurationWithDelay * 100)
    
    if (this.delayedTime >= this.options.delay)
      this.endDelay()
  }
  
  this.timesUpdatedAt = now
  
  this.trigger('update')
  
  if (this.lastPollAt + this.options.poll < Date.now()) {
    this.trigger('poll')
    this.lastPollAt = Date.now()
  }
  
  if (this.remainingTime < 1)
    this.tick()
}

/**
 * Leaves from main interval
 */
Overtimer.prototype.leaveFromMainInterval = function () {
  Overtimer.global.leave(this.globalTimerId)
  this.globalTimerId = null
}

/**
 * Increases the current timer's duration to within the maximum timeout limit.
 * @param customValue {number} Custom duration for bump duration. OvertimeBump option will use if not specified.
 * @return {boolean} true if bump success, false if not
 */
Overtimer.prototype.bump = function (customValue = -1) {
  if (this.state === Overtimer.STATES.STOPPED || this.state === Overtimer.STATES.CREATED) {
    this.log('Can\'t use overtime bump on stopped or created state.', 1011)
    return false
  } else if (typeof this.options.overtimeLimit !== 'number' || this.options.overtimeLimit <= 0) {
    this.log('Can\'t use overtime bump when overtime limit below 0.', 1012)
    return false
  }
  
  let mustBumpFor = (typeof customValue === 'number' && customValue > 0) ? customValue : this.options.overtimeBump
  
  if (typeof mustBumpFor !== 'number' || mustBumpFor <= 0) {
    this.log('Bump value is not valid! Must be number and bigger than 0 for bump:', 1013)
    this.log(mustBumpFor, 1014)
    return false
  }
  
  let maxBump = this.options.overtimeLimit - this.remainingTime
  
  if (maxBump < 0) {
    this.log('Timer not reached the overtime limit yet.', 1015)
    return false
  } else if (mustBumpFor < maxBump) {
    this.remainingTime += mustBumpFor
    this.totalRemainingTime += mustBumpFor
    this.overTime += mustBumpFor
  
    this.repeatDuration += mustBumpFor
    this.repeatDurationWithDelay += mustBumpFor
    this.totalDuration += mustBumpFor
    this.totalDurationWithDelay += mustBumpFor
    this.bumpedAt = Date.now()
    this.trigger('bump', mustBumpFor, this.remainingTime)
  } else {
    this.remainingTime += maxBump
    this.totalRemainingTime += maxBump
    this.overTime += maxBump
  
    this.repeatDuration += maxBump
    this.repeatDurationWithDelay += maxBump
    this.totalDuration += maxBump
    this.totalDurationWithDelay += maxBump
    this.bumpedAt = Date.now()
    this.trigger('bump', maxBump, this.remainingTime)
  }
  return true
}

/**
 * Starts the timer
 * @return {boolean} true if succeeded, false if not
 */
Overtimer.prototype.start = function () {
  if (this.state === Overtimer.STATES.RUNNING || this.state === Overtimer.STATES.WAITING) {
    this.log('Timer is already started.', 1016)
    return false
  }
  
  let totalDuration = this.options.duration * this.options.repeat
  
  if (this.options.delay > 0) {
    this.state = Overtimer.STATES.WAITING
    this.delayedTime = 0
    this.totalDelayedTime = 0
    this.delayStartedAt = Date.now()
    this.totalDurationWithDelay = totalDuration + (this.options.repeat * this.options.delay)
    this.repeatDurationWithDelay = this.options.duration + this.options.delay
  }
  else {
    this.state = Overtimer.STATES.RUNNING
    this.totalDurationWithDelay = totalDuration
    this.repeatDurationWithDelay = this.options.duration
  }
  
  this.startedAt = Date.now()
  this.elapsedTime = 0
  this.totalElapsedTime = 0
  this.pausedTime = 0
  this.overTime = 0
  this.remainingTime = this.options.duration
  this.repeatDuration = this.options.duration
  this.totalRemainingTime = totalDuration
  this.totalDuration = totalDuration
  this.currentRepeat = 1
  
  this.currentRepeatPercentWithDelay = 0
  this.currentRepeatPercent = 0
  this.totalPercentWithDelay = 0
  this.totalPercent = 0
  
  this.timesUpdatedAt = Date.now()
  this.lastPollAt = Date.now()
  
  this.joinToMainInterval()
  this.trigger('start')
  
  if (this.options.delay > 0)
    this.trigger('delaystart')
  
  return true
}

/**
 * Pauses the timer
 * @return {boolean} true if succeeded, false if not
 */
Overtimer.prototype.pause = function () {
  if (this.state !== Overtimer.STATES.RUNNING && this.state !== Overtimer.STATES.WAITING) {
    this.log("Can't pause when timer not running.", 1017)
    return false
  }
  
  this.state = Overtimer.STATES.PAUSED
  this.pausedAt = Date.now()
  
  return true
}

/**
 * Ends delay immediately
 * @return {boolean} return true if succeeded, false if not
 */
Overtimer.prototype.endDelay = function () {
  if (this.state !== Overtimer.STATES.WAITING) {
    this.log("Can't end delay when timer not waiting.", 1018)
    return false
  } else if( typeof this.options.delay !== 'number' || this.options.delay <= 0 ) {
    this.log("Can't end delay when delay option not number or delay below 0.", 1019)
    return false
  }
  let remainingDelay = this.options.delay - this.delayedTime
  
  this.delayEndedAt = Date.now()
  this.state = Overtimer.STATES.RUNNING
  
  if( remainingDelay > 0 ) {
    this.totalDuration -= remainingDelay
    this.totalDurationWithDelay -= remainingDelay
    this.repeatDuration -= remainingDelay
    this.repeatDurationWithDelay -= remainingDelay
  }
  
  this.trigger('delayend')
  return true
}

/**
 * Resumes the paused timer
 * @return {boolean} true if succeeded, false if not
 */
Overtimer.prototype.resume = function () {
  if (this.state !== Overtimer.STATES.PAUSED) {
    this.log("Can't resume when timer not paused.", 1020)
    return false
  }
  if (this.options.delay > 0 && this.delayedTime < this.options.delay)
    this.state = Overtimer.STATES.WAITING
  else
    this.state = Overtimer.STATES.RUNNING
  
  this.resumedAt = Date.now()
  return true
}

/**
 * Repeats the loop
 * @return {boolean} Returns true if succeeded, false if not
 */
Overtimer.prototype.repeat = function () {
  if (this.state !== Overtimer.STATES.RUNNING && this.state !== Overtimer.STATES.WAITING) {
    this.log("Can't repeat when timer not running.", 1021)
    return false
  }
  
  this.totalDuration -= this.remainingTime
  this.totalDurationWithDelay -= this.remainingTime
  
  this.currentRepeat += 1
  this.elapsedTime = 0
  this.remainingTime = this.options.duration
  this.repeatedAt = Date.now()
  this.totalRemainingTime = ( this.options.repeat * this.options.duration ) - ((this.currentRepeat - 1) * this.options.duration)
  this.currentRepeatPercentWithDelay = 0
  this.currentRepeatPercent = 0
  
  if (this.options.delay > 0) {
    this.delayedTime = 0
    this.state = Overtimer.STATES.WAITING
  }
  else
    this.state = Overtimer.STATES.RUNNING
  
  this.timesUpdatedAt = Date.now()
  this.trigger('repeat')
  
  if (this.options.delay > 0)
    this.trigger('delaystart')
  return true
}

/**
 * Works when timer tick time comes.
 */
Overtimer.prototype.tick = function () {
  this.tickedAt = Date.now()
  this.trigger('tick')
  
  if (this.currentRepeat < this.options.repeat)
    this.repeat()
  else {
    this.finishedAt = Date.now()
    this.totalRemainingTime = 0
    this.remainingTime = 0
    this.stoppedAt = Date.now()
    
    this.totalPercentWithDelay = 100
    this.totalPercent = 100
    this.currentRepeatPercent = 100
    this.currentRepeatPercentWithDelay = 100
  
    this.trigger('update')
    this.trigger('poll')
    this.trigger('finish')
    this.stop()
  }
}

/**
 * Stops the timer
 * @return {boolean} Returns true if succeeded, false if not
 */
Overtimer.prototype.stop = function () {
  if (this.state === Overtimer.STATES.STOPPED) {
    this.log('Timer is already stopped.', 1022)
    return false
  }
  this.leaveFromMainInterval()
  
  this.state = Overtimer.STATES.STOPPED
  this.stoppedAt = Date.now()
  
  this.trigger('stop')
  return true
}

if (typeof module !== 'undefined')
  module.exports = Overtimer

if (typeof window !== 'undefined')
  window.Overtimer = Overtimer
