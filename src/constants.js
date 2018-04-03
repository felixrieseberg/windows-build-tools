'use strict'
const inGFW = require('in-gfw')
const pythonMirror = process.env['npm_config_python_mirror'] || process.env.PYTHON_MIRROR || (inGFW.osSync() ? 'https://npm.taobao.org/mirrors/python' : 'https://www.python.org/ftp/python')

let python = {}
let buildTools = {}

if (process.env['npm_config_vs2017']) {
  buildTools = {
    installerName: 'vs_BuildTools.exe',
    installerUrl: 'https://download.visualstudio.microsoft.com/download/pr/11503713/e64d79b40219aea618ce2fe10ebd5f0d/vs_BuildTools.exe',
    logName: null,
    version: 2017
  }
} else {
  buildTools = {
    installerName: 'BuildTools_Full.exe',
    installerUrl: 'https://download.microsoft.com/download/5/f/7/5f7acaeb-8363-451f-9425-68a90f98b238/visualcppbuildtools_full.exe',
    logName: 'build-tools-log.txt',
    version: 2015
  }
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
