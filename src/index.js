'use strict'

const download = require('./download')
const install = require('./install')
const environment = require('./environment')

download()
  .then((result) => install())
  .then(() => environment())
  .catch((error) => console.log(error))
