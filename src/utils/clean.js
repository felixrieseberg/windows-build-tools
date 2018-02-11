const fs = require('fs')
const { getBuildToolsInstallerPath } = require('./get-build-tools-installer-path')
const { getPythonInstallerPath } = require('./get-python-installer-path')

/**
 * Cleans existing log files
 */
function cleanExistingLogFiles () {
  const files = [ getBuildToolsInstallerPath().logPath, getPythonInstallerPath().logPath ]

  files.forEach((file) => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    }
  })
}

module.exports = { cleanExistingLogFiles }
