'use strict'

const path = require('path')
const mockery = require('mockery')
const fs = require('fs')

describe('DownloadTools', () => {
  afterEach(() => mockery.deregisterAll())

  describe('downloadTools (installer)', () => {
    it('should attempt to download the installer', (done) => {
      const installer = require('../../src/utils').getBuildToolsInstallerPath()
      const nuggetMock = function (url, options, cb) {
        url.should.equal(installer.url)
        options.should.be.ok
        options.target.should.equal(installer.fileName)
        options.dir.should.equal(installer.directory)
        cb()
      }

      mockery.registerMock('nugget', nuggetMock)
      require('rewire')('../../src/download').__get__('downloadTools')(installer)
        .should.be.fulfilled.and.notify(done)
    })
  })
})
