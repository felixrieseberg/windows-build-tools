'use strict'

const fs = require('fs-extra')
const path = require('path')

/**
 * Ensures that %USERPROFILE%/.windows-build-tools exists
 * and returns the path to it
 *
 * @returns {string} - Path to windows-build-tools working dir
 */
function getWorkDirectory () {
  const homeDir = process.env.USERPROFILE || require('os').homedir()
  const workDir = path.join(homeDir, '.windows-build-tools')

  try {
    fs.ensureDirSync(workDir)
    return workDir
  } catch (err) {
    console.log(err)
  }
}

module.exports = { getWorkDirectory }
