'use strict'

const path = require('path')

const utils = require('./utils')

/**
 * Uses PowerShell to configure the environment for
 * msvs_version 2015
 *
 * @returns {Promise}
 */
function setEnvironment () {
  const scriptPath = path.join(__dirname, '..', 'ps1', 'set-environment.ps1')
  const psArgs = `& {& '${scriptPath}'}`
  const args = ['-NoProfile', '-NoLogo', psArgs]

  return utils.executeChildProcess('powershell.exe', args)
}

module.exports = setEnvironment
