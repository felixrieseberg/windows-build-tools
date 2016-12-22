'use strict'

const path = require('path')
const mockery = require('mockery')

const ChildProcessMock = require('../../fixtures/child_process')

describe('Install - Launch', () => {
  let passedArgs
  let passedProcess

  const cpMock = {
    spawn(_process, _args) {
      passedProcess = _process
      passedArgs = _args

      return new ChildProcessMock()
    }
  }

  afterEach(() => {
    mockery.deregisterAll()
    passedArgs = undefined
    passedProcess = undefined
  })

  it('should attempt to lauch the installer script', (done) => {
    mockery.registerMock('child_process', cpMock)
    require('../../../lib/install/launch')().should.be.fulfilled
      .then(() => {
        const expectedScriptPath = path.join(__dirname, '..', '..', '..', 'ps1', 'launch-installer.ps1')
        const expectedInstallerPath = path.join(process.env.USERPROFILE || process.env.HOME, '.windows-build-tools')
        const expectedPsArgs = `& {& '${expectedScriptPath}' -path '${expectedInstallerPath}' -extraBuildToolsParameters '' }`
        const expectedArgs = ['-ExecutionPolicy', 'Bypass', '-NoProfile', '-NoLogo', expectedPsArgs]

        passedProcess.should.equal('powershell.exe')
        passedArgs.should.deep.equal(expectedArgs)
      })
      .should.notify(done)
  })
})
