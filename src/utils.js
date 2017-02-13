'use strict'

const fs = require('fs-extra')
const path = require('path')

const constants = require('./constants')

/**
 * Ensures that %USERPROFILE%/.windows-build-tools exists
 * and returns the path to it
 *
 * @returns {string} - Path to windows-build-tools working dir
 */
function getWorkDirectory () {
  const homeDir = process.env.USERPROFILE || require('os').homedir()
  const workDir = path.join(homeDir, '.windows-build-tools')

  try {
    fs.ensureDirSync(workDir)
    return workDir
  } catch (err) {
    log(err)
  }
}

/**
 * Ensures that %USERPROFILE%/.windows-build-tools exists
 * and returns the path to it
 *
 * @returns {Object} - Object containing path and fileName of installer
 */
function getBuildToolsInstallerPath () {
  const directory = getWorkDirectory()
  const buildTools = constants.buildTools

  return {
    path: path.join(directory, buildTools.installerName),
    fileName: buildTools.installerName,
    url: buildTools.installerUrl,
    logPath: path.join(directory, buildTools.logName),
    directory
  }
}

/**
 * Ensures that %USERPROFILE%/.windows-build-tools exists
 * and returns the path to it
 *
 * @returns {Object} - Object containing path and fileName of installer for python
 */
function getPythonInstallerPath () {
  const directory = getWorkDirectory()
  const python = constants.python

  return {
    path: path.join(directory, python.installerName),
    fileName: python.installerName,
    url: python.installerUrl,
    logPath: path.join(directory, python.logName),
    targetPath: path.join(directory, python.targetName),
    directory
  }
}

/**
 * Ensures that the currently running platform is Windows,
 * exiting the process if it is not
 */
function ensureWindows () {
  if (process.platform !== 'win32') {
    log('This tool requires Windows.\n')
    process.exit(1)
  }
}

/**
 * Starts a child process using the provided executable
 *
 * @param fileName      - Path to the executable to start
 * @returns {Promise}   - A promise that resolves when the
 *                      process exits
 */
function executeChildProcess (fileName, args) {
  return new Promise((resolve, reject) => {
    const child = require('child_process').spawn(fileName, args)

    child.on('exit', (code) => {
      if (code !== 0) {
        return reject(new Error(fileName + ' exited with code: ' + code))
      }
      return resolve()
    })

    child.stdin.end()
  })
}

/**
 * Log, unless logging is disabled. Parameters identical with console.log.
 */
function log () {
  if (!process.env.npm_config_disable_logging) {
    console.log.apply(this, arguments)
  }
}

/**
 * Warn, unless logging is disabled. Parameters identical with console.error.
 */
function warn () {
  if (!process.env.npm_config_disable_logging) {
    console.warn.apply(this, arguments)
  }
}

/**
 * Error, unless logging is disabled. arameters identical with console.error.
 */
function error () {
  if (!process.env.npm_config_disable_logging) {
    console.error.apply(this, arguments)
  }
}

module.exports = {
  getWorkDirectory,
  getBuildToolsInstallerPath,
  getPythonInstallerPath,
  ensureWindows,
  executeChildProcess,
  log,
  warn,
  error
}
