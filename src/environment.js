'use strict'

const path = require('path')

const utils = require('./utils')

const installer = utils.getInstallerPath()

/**
 * Uses PowerShell to configure the environment for
 * msvs_version 2015 and npm python 2.7
 *
 * @returns {Promise}
 */
function setEnvironment () {
  const scriptPath = path.join(__dirname, '..', 'ps1', 'set-environment.ps1')
  const psArgs = `& {& '${scriptPath}' -path '${installer.directory}' }`
  const args = ['-NoProfile', '-NoLogo', psArgs]

  return utils.executeChildProcess('powershell.exe', args)
}

module.exports = setEnvironment
