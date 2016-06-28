'use strict'

const path = require('path')
const mockery = require('mockery')

const constants = require('../../src/constants')

describe('DownloadTools', () => {
  afterEach(() => mockery.deregisterAll())

  describe('downloadTools (installer)', () => {
    it('should attempt to download the build tools', (done) => {
      const nuggetMock = function (url, options, cb) {
        url.should.equal(constants.buildToolsUrl)
        options.should.be.ok
        options.target.should.be.ok
        options.dir.should.be.ok

        cb()
      }

      mockery.registerMock('nugget', nuggetMock)
      require('../../lib/download')().should.be.fulfilled.and.notify(done)
    })
  })
})