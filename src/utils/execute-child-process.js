'use strict'

/**
 * Starts a child process using the provided executable
 *
 * @param fileName      - Path to the executable to start
 * @returns {Promise}   - A promise that resolves when the
 *                      process exits
 */
function executeChildProcess (fileName, args) {
  return new Promise((resolve, reject) => {
    const child = require('child_process').spawn(fileName, args)

    child.on('exit', (code) => {
      if (code !== 0) {
        return reject(new Error(fileName + ' exited with code: ' + code))
      }
      return resolve()
    })

    child.stdin.end()
  })
}

module.exports = { executeChildProcess }
