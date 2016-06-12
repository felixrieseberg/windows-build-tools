'use strict'

const download = require('./download')
const install = require('./install')

download()
  .then((result) => install())
  .catch((error) => console.log(error))
