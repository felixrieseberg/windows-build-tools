'use strict'

const nugget = require('nugget')

const constants = require('./constants')
const utils = require('./utils')

/**
 * Downloads the Visual Studio C++ Build Tools to a temporary folder
 * at %USERPROFILE%\.windows-build-tools
 *
 * @returns {Promise.<string>} - Promise resolving with the path to the downloaded file
 */
function download () {
  return new Promise((resolve, reject) => {
    const installer = utils.getInstallerPath()
    const nuggetOptions = {
      target: installer.filename,
      dir: installer.directory,
      resume: true,
      verbose: true,
      strictSSL: false
    }

    nugget(constants.buildToolsUrl, nuggetOptions, (errors) => {
      if (errors) {
        // nugget returns an array of errors but we only need 1st because we only have 1 url
        const error = errors[0]

        if (error.message.indexOf('404') === -1) {
          return reject(error)
        } else {
          return reject(`Could not find Microsoft Visual Studio C++ Build Tools at ${constants.buildToolsUrl}`)
        }
      }

      console.log(`Downloaded build tools. Saved to ${installer.path}.`)
      resolve(installer.path)
    })
  })
}

module.exports = download
