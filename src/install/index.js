'use strict'

const fs = require('fs-extra')
const path = require('path')
const spawn = require('child_process').spawn
const debug = require('debug')('windows-build-tools')
const chalk = require('chalk')

const launchInstaller = require('./launch')
const Tailer = require('./tailer')
const utils = require('../utils')

/**
 * Installs the build tools, tailing the installation log file
 * to understand what's happening
 *
 * @returns {Promise.<Object>} - Promise that resolves with the installation result
 */
function install () {
  return new Promise((resolve, reject) => {
    const buid_tools_tailer = new Tailer(utils.getBuitToolsInstallerPath().logPath)
    const python_tailer = new Tailer(utils.getPythonInstallerPath().logPath, 'ucs2') // The log file for msiexe is utf-16


    buid_tools_tailer.on('exit', (result, details) => {
      debug("build tools tailer exited");
      if (result === 'error') {
        debug('Installer: Tailer found error with installer', details)
        reject(err)
      }

      if (result === 'success') {
        console.log(chalk.bold.green('Successfully installed Visual Studio Build Tools.'))
        debug('Installer: Successfully installed Visual Studio Build Tools according to tailer')
        resolve()
      }

      if (result === 'failure') {
        console.log(chalk.bold.red('Could not install Visual Studio Build Tools.'))
        console.log('Please find more details in the log files, which can be found at')
        console.log(utils.getWorkDirectory())
        debug('Installer: Failed to install according to tailer')
        resolve()
      }
    })

    python_tailer.on('exit', (result, details) => {
      debug("python tailer exited");
      if (result === 'error') {
        debug('Installer: Tailer found error with installer', details)
        reject(err)
      }

      if (result === 'success') {
        console.log(chalk.bold.green('Successfully installed Python 2.7'))
        debug('Installer: Successfully installed Python 2.7 according to tailer')
        // TODO: Actually get the path from the log file. This is for the case that python 2.7 is already installed 
        resolve({pythonPath: utils.getPythonInstallerPath().targetPath})
      }

      if (result === 'failure') {
        console.log(chalk.bold.red('Could not install  Python 2.7.'))
        console.log('Please find more details in the log files, which can be found at')
        console.log(utils.getWorkDirectory())
        debug('Installer: Failed to install Python 2.7 according to tailer')
        resolve()
      }
    })

    console.log(chalk.green('Starting installation...'))

    return launchInstaller()
      .then(() => buid_tools_tailer.start())
      .then(() => python_tailer.start())
      .catch((error) => console.log(error))
  })
}

module.exports = install