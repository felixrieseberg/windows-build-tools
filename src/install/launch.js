'use strict'

const path = require('path')
const spawn = require('child_process').spawn
const chalk = require('chalk')
const debug = require('debug')('windows-build-tools')

const utils = require('../utils')
const installer = utils.getBuitToolsInstallerPath()

/**
 * Launches the installer, using a PS1 script as a middle-man
 *
 * @returns {Promise.<Object>} - Promise that resolves with the launch-installer result
 */
function launchInstaller () {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', '..', 'ps1', 'launch-installer.ps1')
    const psArgs = `& {& '${scriptPath}' -path '${installer.directory}' }`
    const args = ['-NoProfile', '-NoLogo', psArgs]

    debug(`Installer: Launching installer in ${installer.directory} with file ${installer.fileName}`)

    let child

    try {
      child = spawn('powershell.exe', args)
    } catch (error) {
      return reject(error)
    }

    child.stdout.on('data', (data) => {
      debug(`Installer: Stdout from launch-installer.ps1: ${data.toString()}`)

      if (data.toString().includes('Please restart this script from an administrative PowerShell!')) {
        console.log(chalk.bold.red('Please restart this script from an administrative PowerShell!'))
        console.log('The build tools cannot be installed without administrative rights.')
        console.log('To fix, right-click on PowerShell and run "as Administrator".')

        // Bail out
        process.exit(1)
      }
    })

    child.on('exit', () => resolve())
    child.stdin.end()
  })
}

module.exports = launchInstaller