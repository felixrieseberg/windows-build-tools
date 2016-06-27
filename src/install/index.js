'use strict'

const fs = require('fs-extra')
const path = require('path')
const spawn = require('child_process').spawn
const debug = require('debug')('windows-build-tools')
const chalk = require('chalk')

const launchInstaller = require('./launch')
const Tailer = require('./tailer')
const utils = require('../utils')
const installer = utils.getInstallerPath()

/**
 * Installs the build tools, tailing the installation log file
 * to understand what's happening
 *
 * @returns {Promise.<Object>} - Promise that resolves with the installation result
 */
function install () {
  return new Promise((resolve, reject) => {
    const tailer = new Tailer()

    tailer.on('exit', (result, details) => {
      console.log("tailer exited");
      if (result === 'error') {
        debug('Installer: Tailer found error with installer', details)
        reject(err)
      }

      if (result === 'success') {
        console.log(chalk.bold.green('Successfully installed Visual Studio Build Tools.'))
        debug('Installer: Successfully installed according to tailer')
        resolve()
      }

      if (result === 'failure') {
        console.log(chalk.bold.red('Could not install Visual Studio Build Tools.'))
        console.log('Please find more details in the log files, which can be found at')
        console.log(path.join(installer.directory))
        debug('Installer: Failed to install according to tailer')
        resolve()
      }
    })

    console.log(chalk.green('Starting installation...'))

    return launchInstaller()
      .then(() => tailer.start(path.join(installer.directory, 'build-tools-log.txt')))
      .then(() => tailer.start(path.join(installer.directory, 'python-log.txt')))
      .catch((error) => console.log(error))
  })
}

module.exports = install