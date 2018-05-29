import * as fs from 'fs';
import { cleanExistingLogFiles } from '../../src/utils/clean';

const mockBuildToolsInstallerPath = 'C:\\Users\\test\\.windows-build=tools\buildTools.exe';
const mockPythonInstallerPath = 'C:\\Users\\test\\.windows-build=tools\python.exe';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  unlinkSync: jest.fn()
}));

jest.mock('../../src/utils/get-build-tools-installer-path', () => ({
  getBuildToolsInstallerPath: jest.fn(() => ({
    logPath: mockBuildToolsInstallerPath
  }))
}));

jest.mock('../../src/utils/get-python-installer-path', () => ({
  getPythonInstallerPath: jest.fn(() => ({
    logPath: mockPythonInstallerPath
  }))
}));

describe('clean', () => {
  it('does not attempt to delete non-existing files', () => {
    cleanExistingLogFiles();

    expect(fs.existsSync).toHaveBeenCalledTimes(2);
    expect(fs.unlinkSync).toHaveBeenCalledTimes(0);
  });

  it('does attempt to delete existing files', () => {
    (fs.existsSync as any).mockReturnValue(true);

    cleanExistingLogFiles();

    expect(fs.existsSync).toHaveBeenCalledTimes(4);
    expect(fs.unlinkSync).toHaveBeenCalledTimes(2);
  });
});
