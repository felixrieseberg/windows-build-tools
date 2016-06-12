'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const mockery = require('mockery')

chai.should()
chai.use(chaiAsPromised)
mockery.enable({ warnOnUnregistered: false })

global.testing = true

// Run tests
const download = require('./src/download');
const environment = require('./src/environment');
const installLaunch = require('./src/install/launch');
const installTailer = require('./src/install/tailer');