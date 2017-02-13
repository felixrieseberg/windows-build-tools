'use strict'

const path = require('path')
const utils = require('./utils')

/**
 * Uses PowerShell to configure the environment for
 * msvs_version 2015 and npm python 2.7
 *
 * @params variables an object with paths for different environmental variables
 *
 * @returns {Promise}
 */
function setEnvironment (variables) {
  const pythonPath = path.join(variables.python.pythonPath)
  const pythonExePath = path.join(pythonPath, 'python.exe')
  const scriptPath = path.join(__dirname, '..', 'ps1', 'set-environment.ps1')
  const maybeAddToPath = process.env.npm_config_add_python_to_path ? ' -AddPythonToPath' : ''
  const psArgs = `& {& '${scriptPath}' -pythonPath '${pythonPath}' -pythonExePath '${pythonExePath}'${maybeAddToPath} }`
  const args = ['-ExecutionPolicy', 'Bypass', '-NoProfile', '-NoLogo', psArgs]

  return utils.executeChildProcess('powershell.exe', args)
}

module.exports = setEnvironment
