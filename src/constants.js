var buildTools = {
  installerName: 'BuildTools_Full.exe',
  installerUrl: 'http://download.microsoft.com/download/5/f/7/5f7acaeb-8363-451f-9425-68a90f98b238/visualcppbuildtools_full.exe',
  logName: 'build-tools-log.txt'
}

var python = {
  installerName: 'python-2.7.11.amd64.msi',
  installerUrl: 'https://www.python.org/ftp/python/2.7.11/python-2.7.11.amd64.msi',
  targetName: 'python27',
  logName: 'python-log.txt'
}

module.exports = {
  buildTools,
  python
}
