'use strict'

const pythonMirror = process.env['npm_config_python_mirror'] || process.env.PYTHON_MIRROR || 'https://www.python.org/ftp/python/'

let python = {}

const buildTools = {
  installerName: 'vs_BuildTools.exe',
  installerUrl: 'https://download.visualstudio.microsoft.com/download/pr/11503713/e64d79b40219aea618ce2fe10ebd5f0d/vs_BuildTools.exe'
}

if (process.arch === 'x64') {
  python = {
    installerName: 'python-2.7.14.amd64.msi',
    installerUrl: pythonMirror.replace(/\/*$/, '/2.7.14/python-2.7.14.amd64.msi'),
    targetName: 'python27',
    logName: 'python-log.txt'
  }
} else {
  python = {
    installerName: 'python-2.7.14.msi',
    installerUrl: pythonMirror.replace(/\/*$/, '/2.7.14/python-2.7.14.msi'),
    targetName: 'python27',
    logName: 'python-log.txt'
  }
}

module.exports = {
  buildTools,
  python
}
