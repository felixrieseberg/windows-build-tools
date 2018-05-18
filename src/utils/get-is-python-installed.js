const { execSync } = require('child_process')

function getIsPythonInstalled() {
  try {
    const output = execSync('python -V')

    if (output && output.includes(' 2.')) {
      return output
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}

module.exports = { getIsPythonInstalled }