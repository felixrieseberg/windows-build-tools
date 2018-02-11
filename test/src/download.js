'use strict'

const mockery = require('mockery')

const installer = require('../../src/utils/get-build-tools-installer-path').getBuildToolsInstallerPath()

describe('DownloadTools', () => {
  afterEach(() => mockery.deregisterAll())

  describe('downloadTools (installer)', () => {
    it('should attempt to download the installer', (done) => {
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
