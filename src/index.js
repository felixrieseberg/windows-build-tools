'use strict'

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
