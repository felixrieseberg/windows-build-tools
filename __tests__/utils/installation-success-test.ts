import * as fs from 'fs-extra';
import { includesFailure, includesSuccess } from '../../src/utils/installation-sucess';

jest.mock('../../src/constants', () => ({
  BUILD_TOOLS: { version: 2015 }
}));

describe('installation-success', () => {
  describe('includesSuccess', () => {
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

      expect(includesSuccess('Setting string variable \'IsInstalled\' to value \'1\'')).toEqual({
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
});
