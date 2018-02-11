'use strict'

const fs = require('fs-extra')
const debug = require('debug')('windows-build-tools')
const EventEmitter = require('events')

const { findVCCLogFile } = require('../utils/find-logfile')
const { includesSuccess, includesFailure } = require('../utils/installation-sucess')

class Tailer extends EventEmitter {
  constructor (logfile, encoding = 'utf8') {
    super()
    this.logFile = logfile
    this.encoding = encoding
  }

  /**
   * Starts watching a the logfile
   */
  start () {
    if (this.logFile) {
      debug(`Tail: Waiting for log file to appear in ${this.logFile}`)
    } else {
      debug(`Tail: Waiting for log file to appear. Searching in %TEMP%`)
    }
    this.waitForLogFile()
  }

  /**
   * Stop watching
   */
  stop (...args) {
    debug(`Tail: Stopping`, ...args)
    this.emit('exit', ...args)
    clearInterval(this.tail)
  }

  /**
   * Start tailing things
   */
  tail () {
    debug(`Tail: Tailing ${this.logFile}`)
    this.tail = setInterval(() => {
      this.handleData()
    }, 5000)
  }

  /**
   * Handle data and see if there's something we'd like to report
   */
  handleData () {
    let data

    try {
      data = fs.readFileSync(this.logFile, this.encoding)
    } catch (err) {
      debug(`Tail start: Could not read logfile ${this.logFile}: ${err}`)
      return
    }

    if (data && data.length > 0) {
      const split = data.split(/\r?\n/) || [ 'Still looking for log file...' ]
      const lastLines = split.slice(split.length - 3, split.length)
      this.emit('lastLines', lastLines)
    }

    const success = includesSuccess(data)

    if (success.isBuildToolsSuccess) {
      debug(`Tail: Reporting success for VCC Build Tools`)
      this.stop('success')
    } else if (success.isPythonSuccess) {
      // Finding the python installation path from the log file
      const matches = data.match(/Property\(S\): TARGETDIR = (.*)\r\n/)
      let pythonPath

      if (matches) {
        pythonPath = matches[1]
      }
      
      debug(`Tail: Reporting success for Python`)
      this.stop('success', pythonPath)
    } else if (includesFailure(data)) {
      debug(`Tail: Reporting failure in ${this.logFile}`)
      this.stop('failure')
    }

    // Aid garbage collector
    data = undefined
  }

  /**
   * Waits for a given file, resolving when it's available
   *
   * @param file {string} - Path to file
   * @returns {Promise.<Object>} - Promise resolving with fs.stats object
   */
  waitForLogFile () {
    const handleStillWaiting = () => {
      debug('Tail: waitForFile: still waiting')
      setTimeout(this.waitForLogFile.bind(this), 2000)
    }

    const handleKnownPath = (logFile) => {
      fs.lstat(logFile, (err, stats) => {
        if (err && err.code === 'ENOENT') {
          handleStillWaiting()
        } else if (err) {
          debug('Tail: waitForFile: Unexpected error', err)
          throw new Error(err)
        } else {
          debug(`Tail: waitForFile: Found ${logFile}`)
          this.tail()
        }
      })
    }

    // If don't have a logfile, we need to find one. The only one
    // we need to find right now is the VCC 2017 logfile.
    if (!this.logFile) {
      findVCCLogFile().then((logFile) => {
        debug(`Tail: LogFile found: ${logFile}`)

        if (!logFile) {
          handleStillWaiting()
        } else {
          this.logFile = logFile
          handleKnownPath(logFile)
        }
      })
    } else {
      handleKnownPath(this.logFile)
    }
  }
}

module.exports = Tailer
