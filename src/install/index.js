'use strict'

const debug = require('debug')('windows-build-tools')
const chalk = require('chalk')
const Spinner = require('cli-spinner').Spinner

const { getPythonInstallerPath } = require('../utils/get-python-installer-path')
const { getWorkDirectory } = require('../utils/get-work-dir')
const { log } = require('../logging')
const launchInstaller = require('./launch')
const Tailer = require('./tailer')

let spinner

/**
 * Installs the build tools, tailing the installation log file
 * to understand what's happening
 *
 * @returns {Promise.<Object>} - Promise that resolves with the installation result
 */

function install (cb) {
  log(chalk.green('Starting installation...'))

  launchInstaller()
    .then(() => launchSpinner())
    .then(() => Promise.all([installBuildTools(), installPython()]))
    .then((paths) => {
      stopSpinner()

      const variables = {
        buildTools: paths[0],
        python: paths[1]
      }
      cb(variables)
    })
    .catch((error) => {
      stopSpinner()

      log(error)
    })
}

function stopSpinner () {
  if (spinner) {
    spinner.stop(false)
  }
}

function launchSpinner () {
  log('Launched installers, now waiting for them to finish.')
  log('This will likely take some time - please be patient!')

  spinner = new Spinner(`Waiting for installers... %s`)
  spinner.setSpinnerDelay(180)
  spinner.start()
}

function installBuildTools () {
  return new Promise((resolve, reject) => {
    const tailer = new Tailer()

    tailer.on('exit', (result, details) => {
      debug('Install: Build tools tailer exited')

      if (result === 'error') {
        debug('Installer: Tailer found error with installer', details)
        reject()
      }

      if (result === 'success') {
        log(chalk.bold.green('Successfully installed Visual Studio Build Tools.'))
        debug('Installer: Successfully installed Visual Studio Build Tools according to tailer')
        resolve()
      }

      if (result === 'failure') {
        log(chalk.bold.red('Could not install Visual Studio Build Tools.'))
        log('Please find more details in the log files, which can be found at')
        log(getWorkDirectory())
        debug('Installer: Failed to install according to tailer')
        resolve()
      }
    })

    tailer.start()
  })
}

function installPython () {
  return new Promise((resolve, reject) => {
    // The log file for msiexe is utf-16
    const tailer = new Tailer(getPythonInstallerPath().logPath, 'ucs2')

    tailer.on('exit', (result, details) => {
      debug('python tailer exited')
      if (result === 'error') {
        debug('Installer: Tailer found error with installer', details)
        reject()
      }

      if (result === 'success') {
        log(chalk.bold.green('Successfully installed Python 2.7'))
        debug('Installer: Successfully installed Python 2.7 according to tailer')

        var variables = {
          pythonPath: details || getPythonInstallerPath().targetPath
        }
        resolve(variables)
      }

      if (result === 'failure') {
        log(chalk.bold.red('Could not install Python 2.7.'))
        log('Please find more details in the log files, which can be found at')
        log(getWorkDirectory())
        debug('Installer: Failed to install Python 2.7 according to tailer')
        resolve(undefined)
      }
    })

    tailer.start()
  })
}

module.exports = install
