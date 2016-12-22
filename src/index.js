'use strict'

// Set verbose mode
if (process.env.npm_config_debug) {
  process.env.DEBUG = '*'
}

require('./compatible')

const download = require('./download')
const install = require('./install')
const environment = require('./environment')

// Here lie the bodies of promises, killed in
// the name of better garbage collection
download(function () {
  install(function (variables) {
    environment(variables)
  })
})
