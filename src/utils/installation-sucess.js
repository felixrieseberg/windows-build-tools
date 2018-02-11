'use strict'

const { buildTools } = require('../constants')

function includesSuccess (input = '') {
  let isBuildToolsSuccess
  let isPythonSuccess

  if (buildTools.version === 2015) {
    // Success strings for build tools (2015)
    isBuildToolsSuccess = input.includes('Variable: IsInstalled = 1') ||
      input.includes('Variable: BuildTools_Core_Installed = ') ||
      input.includes('WixBundleInstalled = 1')
  } else {
    // Success strings for build tools (2017)
    isBuildToolsSuccess = input.includes('Closing installer. Return code: 3010.') ||
      input.includes('Closing installer. Return code: 0.')
  }

  // Success strings for Python
  isPythonSuccess = input.includes('INSTALL. Return value 1') ||
    input.includes('Installation completed successfully') ||
    input.includes('Configuration completed successfully')

  return {
    isBuildToolsSuccess,
    isPythonSuccess
  }
}

function includesFailure (input = '') {
  return input.includes('Closing installer. Return code:') ||
    input.includes('Shutting down, exit code:')
}

module.exports = { includesSuccess, includesFailure }
