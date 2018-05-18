const { spawnSync } = require('child_process')

function getIsPythonInstalled() {
  try {
    const { output } = spawnSync('python', [ '-V' ], { windowsHide: true, stdio: null })
    const version = output.toString().trim().replace(/,/g, '')

    if (version && version.includes(' 2.')) {
      return version
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}

module.exports = { getIsPythonInstalled }