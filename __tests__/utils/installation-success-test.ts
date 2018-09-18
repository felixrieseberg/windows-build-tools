import * as fs from 'fs-extra';

jest.mock('../../src/constants', () => ({
  BUILD_TOOLS: { version: 2015 }
}));

describe('installation-success', () => {
  describe('includesSuccess', () => {
    const { includesSuccess } = require('../../src/utils/installation-sucess');

    it('correctly reports success', () => {
      expect(includesSuccess('Variable: IsInstalled = 1')).toEqual({
        isBuildToolsSuccess: true,
        isPythonSuccess: false
      });

      expect(includesSuccess('Variable: BuildTools_Core_Installed = ')).toEqual({
        isBuildToolsSuccess: true,
        isPythonSuccess: false
      });

      expect(includesSuccess('WixBundleInstalled = 1')).toEqual({
        isBuildToolsSuccess: true,
        isPythonSuccess: false
      });

      expect(includesSuccess('Blubblub')).toEqual({
        isBuildToolsSuccess: false,
        isPythonSuccess: false
      });

      expect(includesSuccess('INSTALL. Return value 1')).toEqual({
        isBuildToolsSuccess: false,
        isPythonSuccess: true
      });

      expect(includesSuccess('Installation completed successfully')).toEqual({
        isBuildToolsSuccess: false,
        isPythonSuccess: true
      });

      expect(includesSuccess('Configuration completed successfully')).toEqual({
        isBuildToolsSuccess: false,
        isPythonSuccess: true
      });
    });
  });

  describe('includesFailure', () => {
    const { includesFailure } = require('../../src/utils/installation-sucess');

    it('correctly reports failure for build tools', () => {
      expect(includesFailure('Closing installer. Return code: -13')).toEqual({
        isBuildToolsFailure: true,
        isPythonFailure: false
      });

      expect(includesFailure('Shutting down, exit code: -13')).toEqual({
        isBuildToolsFailure: true,
        isPythonFailure: false
      });
    });

    it('correctly reports failure for Python', () => {
      expect(includesFailure('(64-bit) -- Installation failed.')).toEqual({
        isBuildToolsFailure: false,
        isPythonFailure: true
      });
    });
  });

  describe('VS log files', () => {
    function testLog(file, installEndLine, success, vsVersion) {
      // file must end in .txt because .log is gitignored
      // installEndLine is the first line (zero based) of the last block of timestamps,
      // it should point to the moment the installer starts cleaning up.

      jest.setMock('../../src/constants', {
        BUILD_TOOLS: { version: vsVersion }
      });
      jest.resetModules();
      const { includesSuccess, includesFailure } = require('../../src/utils/installation-sucess');

      const finalText = fs.readFileSync(`${__dirname}/logfiles/${file}.txt`, 'utf8');
      const installingText = finalText.split(/\r?\n/).slice(0, installEndLine).join('\n');

      expect(includesSuccess(installingText).isBuildToolsSuccess).toEqual(false);
      expect(includesFailure(installingText).isBuildToolsFailure).toEqual(false);

      if (success) {
        expect(includesSuccess(finalText).isBuildToolsSuccess).toEqual(true);
        // Don't check failure, it can be true in case of success.
      } else {
        expect(includesSuccess(finalText).isBuildToolsSuccess).toEqual(false);
        expect(includesFailure(finalText).isBuildToolsFailure).toEqual(true);
      }
    }

    it('VS2015 successful intallation', () => {
      testLog('vs2015-success', 3494, true, 2015);
    });

    it('VS2017 successful intallation', () => {
      testLog('vs2017-success', 75, true, 2017);
    });
  });
});
