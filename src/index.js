'use strict'

const download = require('./download')
const install = require('./install')
const environment = require('./environment')

download()
  .then(() => install())
  .then((variables) => environment(variables))
  .catch((error) => console.log(error))
