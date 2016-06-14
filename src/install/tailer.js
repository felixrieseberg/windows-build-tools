'use strict'

const path = require('path')
const fs = require('fs-extra')
const debug = require('debug')('windows-build-tools')
const EventEmitter = require('events')

const utils = require('../utils')
const installer = utils.getInstallerPath()

class Tailer extends EventEmitter {
  constructor() {
    super()
    this.logFile = path.join(installer.directory, 'log.txt')
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
    fs.readFile(this.logFile, (err, data) => {
      if (err) {
        debug(`Tail start: Could not read logfile ${this.logFile}`)
      } else {
        const parsedData = data.toString()
        
        if (parsedData.includes('Variable: IsInstalled = 1') ||
            parsedData.includes('Variable: BuildTools_Core_Installed = ') ||
            parsedData.includes('WixBundleInstalled = 1')) {
          this.stop('success')
          return
        }

        if (parsedData.includes('Shutting down, exit code:')) {
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
