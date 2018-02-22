'use strict'

const path = require('path')
const spawn = require('child_process').spawn
const chalk = require('chalk')
const debug = require('debug')('windows-build-tools')

const { log } = require('../logging')
const { getBuildToolsInstallerPath } = require('../utils/get-build-tools-installer-path')
const { getPythonInstallerPath } = require('../utils/get-python-installer-path')

const vccInstaller = getBuildToolsInstallerPath()
const pythonInstaller = getPythonInstallerPath()
const { buildTools } = require('../constants')

/**
 * Launches the installer, using a PS1 script as a middle-man
 *
 * @returns {Promise.<Object>} - Promise that resolves with the launch-installer result
 */
function launchInstaller () {
  return new Promise((resolve, reject) => {
    let extraArgs = ''
    let parsedArgs = {}

    if (process.env.npm_config_vcc_build_tools_parameters) {
      try {
        parsedArgs = JSON.parse(process.env.npm_config_vcc_build_tools_parameters)

        if (parsedArgs && parsedArgs.length > 0) {
          extraArgs = parsedArgs.join('%_; ')
        }
      } catch (e) {
        debug(`Installer: Parsing additional arguments for VCC build tools failed: ${e.message}`)
        debug(`Input received: ${process.env.npm_config_vcc_build_tools_parameters}`)
      }
    }

    const scriptPath = path.join(__dirname, '..', '..', 'ps1', 'launch-installer.ps1')
    const vccParam = `-visualStudioVersion '${buildTools.version.toString()}'`
    const pathParam = `-path '${vccInstaller.directory}'`
    const buildToolsParam = `-extraBuildToolsParameters '${extraArgs}'`
    const pythonParam = `-pythonInstaller '${pythonInstaller.fileName}'`
    const psArgs = `& {& '${scriptPath}' ${pathParam} ${buildToolsParam} ${pythonParam} ${vccParam} }`
    const args = ['-ExecutionPolicy', 'Bypass', '-NoProfile', '-NoLogo', psArgs]

    debug(`Installer: Launching installer in ${vccInstaller.directory} with file ${vccInstaller.fileName}.`)

    let child

    try {
      child = spawn('powershell.exe', args)
    } catch (error) {
      log(chalk.bold.red('Error: failed while trying to run powershell.exe'))
      log('(Hint: Is "%SystemRoot%\\system32\\WindowsPowerShell\\v1.0" in your system path?)')
      return reject(error)
    }

    child.stdout.on('data', (data) => {
      debug(`Installer: Stdout from launch-installer.ps1: ${data.toString()}`)

      if (data.toString().includes('Please restart this script from an administrative PowerShell!')) {
        log(chalk.bold.red('Please restart this script from an administrative PowerShell!'))
        log('The build tools cannot be installed without administrative rights.')
        log('To fix, right-click on PowerShell and run "as Administrator".')

        // Bail out
        process.exit(1)
      }
    })

    child.stderr.on('data', (data) => debug(`Installer: Stderr from launch-installer.ps1: ${data.toString()}`))

    child.on('exit', () => resolve())
    child.stdin.end()
  })
}

module.exports = launchInstaller
