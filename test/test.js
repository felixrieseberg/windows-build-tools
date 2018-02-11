'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const mockery = require('mockery')

chai.should()
chai.use(chaiAsPromised)
mockery.enable({ warnOnUnregistered: false })

global.testing = true

// Run tests
require('./src/download')
require('./src/environment')
