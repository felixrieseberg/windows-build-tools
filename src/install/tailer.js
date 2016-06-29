'use strict'

const path = require('path')
const fs = require('fs-extra')
const debug = require('debug')('windows-build-tools')
const EventEmitter = require('events')

const utils = require('../utils')

class Tailer extends EventEmitter {
  constructor(logfile, encoding = 'utf8') {
    super()
    this.logFile = logfile
    this.encoding = encoding
  }

  /**
   * Starts watching a the logfile
   */
  start() {
    debug(`Tail: Waiting for log file to appear in ${this.logFile}`)
    this.waitForLogFile()
      .then(() => this.tail())
  }

  /**
   * Stop watching
   */
  stop(...args) {
    debug(`Tail: Stopping`, ...args)
    this.emit('exit', ...args)
    clearInterval(this.tail)
  }

  /**
   * Start tailing things
   */
  tail() {
    debug(`Tail: Tailing ${this.logFile}`)
    this.tail = setInterval(() => {
      this.handleData()
    }, 1000)
  }

  /**
   * Handle data and see if there's something we'd like to report
   */
  handleData(data) {
    fs.readFile(this.logFile, this.encoding, (err, data) => {
      if (err) {
        debug(`Tail start: Could not read logfile ${this.logFile}: ${err}`)
      } else {

        // Success strings for build tools
        if (data.includes('Variable: IsInstalled = 1') ||
            data.includes('Variable: BuildTools_Core_Installed = ') ||
            data.includes('WixBundleInstalled = 1')) {
          this.stop('success')
          return
        }

        // Success strings for python
        if (data.includes('INSTALL. Return value 1') ||
            data.includes('Installation completed successfully') ||
            data.includes('Configuration completed successfully')) {
          // Finding the python installation path from the log file
          var matches = data.match(/Property\(S\): TARGETDIR = (.*)\r\n/)
          var pythonPath = undefined
          if (matches) {
            pythonPath = matches[1]
          }
          this.stop('success', pythonPath)
          return
        }

        if (data.includes('Shutting down, exit code:')) {
          this.stop('failure')
          return
        }
      }
    })
  }

  /**
   * Waits for a given file, resolving when it's available
   *
   * @param file {string} - Path to file
   * @returns {Promise.<Object>} - Promise resolving with fs.stats object
   */
  waitForLogFile() {
    return new Promise((resolve, reject) => {
      fs.lstat(this.logFile, (err, stats) => {
        if (err && err.code === 'ENOENT') {
          debug('Tail: waitForFile: still waiting')
          resolve(this.waitForLogFile(this.logFile))
        } else if (err) {
          debug('Tail: waitForFile: Unexpected error', err)
          reject(err)
        } else {
          debug(`Tail: waitForFile: Found ${this.logFile}`)
          resolve(stats)
        }
      })
    })
  }
}

module.exports = Tailer
