'use strict'

const path = require('path')

const getWorkDirectory = require('./get-work-dir').getWorkDirectory
const constants = require('../constants')

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

module.exports = { getPythonInstallerPath }
