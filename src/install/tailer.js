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
    }, 30000)
  }

  /**
   * Handle data and see if there's something we'd like to report
   */
  handleData() {
    let data

    try {
      data = fs.readFileSync(this.logFile, this.encoding)
    } catch (err) {
      debug(`Tail start: Could not read logfile ${this.logFile}: ${err}`)
    }

    // Success strings for build tools
    if (data.includes('Variable: IsInstalled = 1') ||
        data.includes('Variable: BuildTools_Core_Installed = ') ||
        data.includes('WixBundleInstalled = 1')) {
      this.stop('success')
    // Success strings for python
    } else if (data.includes('INSTALL. Return value 1') ||
        data.includes('Installation completed successfully') ||
        data.includes('Configuration completed successfully')) {
      // Finding the python installation path from the log file
      const matches = data.match(/Property\(S\): TARGETDIR = (.*)\r\n/)
      let pythonPath = undefined

      if (matches) {
        pythonPath = matches[1]
      }
      this.stop('success', pythonPath)
    } else if (data.includes('Shutting down, exit code:')) {
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
  waitForLogFile() {
    fs.lstat(this.logFile, (err, stats) => {
      if (err && err.code === 'ENOENT') {
        debug('Tail: waitForFile: still waiting')
        setTimeout(this.waitForLogFile.bind(this), 2000)
      } else if (err) {
        debug('Tail: waitForFile: Unexpected error', err)
        throw new Error(err);
      } else {
        debug(`Tail: waitForFile: Found ${this.logFile}`)
        this.tail()
      }
    })
  }
}

module.exports = Tailer
