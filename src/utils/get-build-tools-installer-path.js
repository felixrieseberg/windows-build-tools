'use strict'

const path = require('path')

const getWorkDirectory = require('./get-work-dir').getWorkDirectory
const constants = require('../constants')

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
    logPath: buildTools.logName ? path.join(directory, buildTools.logName) : null,
    directory
  }
}

module.exports = { getBuildToolsInstallerPath }
