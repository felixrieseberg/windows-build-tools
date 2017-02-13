module.export = (function () {
  if (process.version === 'v7.1.0') {
    const utils = require('./utils')

    utils.warn('--------------------------------------------------------------')
    utils.warn('You are running Node v7.1.0, which has a known bug on Windows,')
    utils.warn('breaking Node applications using the utils (Powershell/CMD).')
    utils.warn('Please upgrade to a newer version or use Node v7.0.0.\n\n')
    utils.warn('Visit https://github.com/nodejs/node/issues/9542 for details.\n')
    utils.warn('windows-build-tools will now run, but might fail.')
    utils.warn('---------------------------------------------------------------')
  }

  if (!/^win/.test(process.platform)) {
    throw new Error('This script upgrades npm on Windows, but the OS is not Windows.')
  }
}())
