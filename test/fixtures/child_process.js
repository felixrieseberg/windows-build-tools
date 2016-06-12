'use strict'

const EventEmitter = require('events')

module.exports = class ChildProcessMock extends EventEmitter {
  constructor() {
    super()

    this.stdout = {
      on() {}
    }
    this.stderr = {
      on() {}
    }
    this.stdin = {
      end: () => {
        this.emit('exit', 0)
      }
    }
  }
}