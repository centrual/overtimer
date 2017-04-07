/**
 * Overtimer constructor.
 * @param duration {Number} Duration of timer
 * @param opts {Object} Overtimer options
 * @constructor
 */
function Overtimer(duration = 1000, opts = {}) {
  if (typeof duration !== 'number') {
    this.log('Duration must be number value.', 1000)
    duration = 1000
  } else if (duration <= 0) {
    this.log('Duration must be bigger than 0.', 1001)
    duration = 1000
  } else if (typeof opts !== 'object') {
    this.log('Options must be object.', 1002)
    opts = {}
  }
  
  this.eventHandlers = {
    'start': [],
    'tick': [],
    'stop': [],
    'repeat': [],
    'update': []
  }
  
  let defaults = {
    duration,
    
    repeat: 1,
    debug: false,
    start: true
  }
  
  this.options = Object.assign({}, defaults, opts)
  
  // Properties
  this.globalTimerId = null
  this.state = Overtimer.STATES.CREATED
  
  this.createdAt = Date.now()
  this.startedAt = -1
  this.repeatedAt = -1
  this.tickedAt = -1
  this.stoppedAt = -1
  
  this.elapsedTime = -1
  this.remainingTime = -1
  this.totalElapsedTime = -1
  this.totalRemainingTime = -1
  this.currentRepeat = -1
  
  this.timesUpdatedAt = -1
  
  if( this.options.start )
    this.start()
}

/**
 * Logs errors if debug enabled
 * @param msg {String} Message will be displayed
 * @param code {Number} Code will be displayed
 */
Overtimer.prototype.log = function( msg = 'Unexcepted error.', code = -1 ) {
  if( this.options.debug )
    console.log(`${code !== -1 ? '( ' + code.toString() + ' ): ' : ''} ${msg}`)
}

/**
 * Registers callback to event.
 * @param eventName {String} Selected event name from available events.
 * @param callback {Function} Function to be triggered when the event occurs.
 * @return {Boolean} true if succeeded, false if not.
 */
Overtimer.prototype.on = function( eventName, callback ) {
  if( typeof eventName !== 'string' ) {
    this.log('Event name must be string.', 1000)
    return false
  } else if( eventName.length < 1) {
    this.log('Event name length be bigger than 0.', 1001)
    return false
  } else if( typeof this.eventHandlers[eventName] === 'undefined' ) {
    this.log('Event name not registered!', 1002)
    return false
  } else if( typeof callback !== 'function' ) {
    this.log('Callback is not function!', 1003)
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
Overtimer.prototype.off = function( eventName, func = null ) {
  if( typeof eventName !== 'string' ) {
    this.log('Event name must be string.', 1004)
    return false
  } else if( eventName.length < 1) {
    this.log('Event name length be bigger than 0.', 1005)
    return false
  } else if( typeof this.eventHandlers[eventName] === 'undefined' ) {
    this.log('Event name not registered!', 1006)
    return false
  }
  
  if( typeof func === 'function' )
    this.eventHandlers[eventName] = this.eventHandlers[eventName].filter( f => f !== func )
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
Overtimer.prototype.trigger = function(eventName, payload=[]) {
  if (typeof eventName !== 'string') {
    this.log('Event name must be string.', 1006)
    return false
  } else if (eventName.length < 1) {
    this.log("Event name's length must bigger than 1.", 1007)
    return false
  } else if( typeof this.eventHandlers[eventName.toLowerCase()] === 'undefined' || !Array.isArray(this.eventHandlers[eventName.toLowerCase()]) ) {
    this.log('Event not found in list.', 1008)
    return false
  }
  
  if( typeof payload !== 'undefined' && !Array.isArray(payload) ) {
    payload = [payload]
  } else if( typeof payload === 'undefined' ) {
    this.log('Payload comes undefined.', 1009)
    payload = []
  }
  
  this.eventHandlers[eventName.toLowerCase()].forEach((evt) => {
    evt.apply(payload)
  })
  
  return true
}

/**
 * Joins main interval for updates.
 * @private
 */
Overtimer.prototype.joinToMainInterval = function() {
  this.globalTimerId = Overtimer.global.join(this.tickMainInterval.bind(this))
}

/**
 * All time updates happens in this function.
 * @private
 */
Overtimer.prototype.tickMainInterval = function() {
  let now = Date.now(),
    diff = now - this.timesUpdatedAt
  
  this.elapsedTime += diff
  this.remainingTime -= diff
  this.totalElapsedTime += diff
  this.totalRemainingTime -= diff
  
  this.timesUpdatedAt = now
  
  this.trigger('update')
  
  if( this.remainingTime < 1 )
    this.tick()
}

/**
 * Leaves from main interval
 * @private
 */
Overtimer.prototype.leaveFromMainInterval = function() {
  Overtimer.global.leave(this.globalTimerId)
  this.globalTimerId = null
}

/**
 * Starts the timer
 * @return {boolean} true if succeeded, false if not
 */
Overtimer.prototype.start = function () {
  if( this.state === Overtimer.STATES.RUNNING ) {
    this.log('Timer is already started.', 1010)
    return false
  }
  
  this.state = Overtimer.STATES.RUNNING
  this.startedAt = Date.now()
  this.elapsedTime = 0
  this.totalElapsedTime = 0
  this.remainingTime = this.options.duration
  this.totalRemainingTime = this.options.duration * this.options.repeat
  this.currentRepeat = 1

  this.timesUpdatedAt = Date.now()

  this.joinToMainInterval()
  this.trigger('start')
  return true
}

/**
 * Repeats the loop
 * @return {boolean} Returns true if succeeded, false if not
 */
Overtimer.prototype.repeat = function() {
  if( this.state !== Overtimer.STATES.RUNNING ) {
    this.log("Can't repeat when timer not running.", 1012)
    return false
  }
  
  this.currentRepeat += 1
  this.elapsedTime = 0
  this.remainingTime = this.options.duration
  this.repeatedAt = Date.now()
  this.totalRemainingTime = ( this.options.repeat * this.options.duration ) - (this.currentRepeat * this.options.duration)
  
  this.timesUpdatedAt = Date.now()
  this.trigger('repeat')
  return true
}

/**
 * Works when timer tick time comes.
 */
Overtimer.prototype.tick = function() {
  this.tickedAt = Date.now()
  this.trigger('tick')
  
  if( this.currentRepeat < this.options.repeat )
    this.repeat()
  else
    this.stop()
}

/**
 * Stops the timer
 * @return {boolean} Returns true if succeeded, false if not
 */
Overtimer.prototype.stop = function () {
  if( this.state === Overtimer.STATES.STOPPED ) {
    this.log('Timer is already stopped.', 1011)
    return false
  }
  this.leaveFromMainInterval()
  
  this.state = Overtimer.STATES.STOPPED
  this.stoppedAt = Date.now()
  
  this.trigger('stop')
  return true
}


/**
 * Enum for Overtimer states.
 * @type {{CREATED: number, RUNNING: number, PAUSED: number, STOPPED: number}}
 */
Overtimer.STATES = {
  CREATED: 0,
  RUNNING: 1,
  PAUSED: 2,
  STOPPED: 3
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
  join( callback ) {
    let found = Overtimer.global.callbacks.find( f => f.callback === callback )
    
    if( typeof found === 'undefined' ) {
      Overtimer.global.lastId += 1
      Overtimer.global.callbacks.push({callback, id: Overtimer.global.lastId})
    } else {
      return found.id
    }
    
    if( Overtimer.global.timer === null )
      Overtimer.global.timer = setInterval(Overtimer.global.tick, Overtimer.global.updateMs)
    
    return Overtimer.global.lastId
  },
  
  /**
   * Leaves from global timer list
   * @param id {number} Auto generated id from join for leave.
   */
  leave( id ) {
    Overtimer.global.callbacks = Overtimer.global.callbacks.filter(c => c.id !== id)
    
    if( Overtimer.global.callbacks.length === 0 && Overtimer.global.timer !== null ) {
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

module.exports = Overtimer
