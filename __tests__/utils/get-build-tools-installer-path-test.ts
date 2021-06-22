jest.mock('../../src/utils/get-work-dir', () => ({
  getWorkDirectory: jest.fn(() => 'C:\\workDir')
}));

jest.mock('../../src/utils/get-is-python-installed', () => ({
  getIsPythonInstalled: jest.fn(() => null)
}));

describe('getBuildToolsInstallerPath', () => {
  it('gets the correct information (2015)', () => {
    process.env.npm_config_vs2015 = 'true';

    const { getBuildToolsInstallerPath } = require('../../src/utils/get-build-tools-installer-path');

    expect(getBuildToolsInstallerPath()).toEqual({
      directory: 'C:\\workDir',
      fileName: 'BuildTools_Full.exe',
      logPath: 'C:\\workDir\\build-tools-log.txt',
      path: 'C:\\workDir\\BuildTools_Full.exe',
      url: 'https://download.microsoft.com/download/5/f/7/5f7acaeb-8363-451f-9425-68a90f98b238/visualcppbuildtools_full.exe',
    });

    delete process.env.npm_config_vs2015;
  });

  it('gets the correct information (2017)', () => {
    process.env.npm_config_vs2017 = 'true';

    jest.resetModules();

    const { getBuildToolsInstallerPath } = require('../../src/utils/get-build-tools-installer-path');

    expect(getBuildToolsInstallerPath()).toEqual({
      directory: 'C:\\workDir',
      fileName: 'vs_BuildTools.exe',
      logPath: null,
      path: 'C:\\workDir\\vs_BuildTools.exe',
      url: 'https://download.visualstudio.microsoft.com/download/pr/11503713/e64d79b40219aea618ce2fe10ebd5f0d/vs_BuildTools.exe',
    });

    delete process.env.npm_config_vs2017;
  });

  it('gets the correct information (2019)', () => {
    process.env.npm_config_vs2019 = 'true';

    jest.resetModules();

    const { getBuildToolsInstallerPath } = require('../../src/utils/get-build-tools-installer-path');

    expect(getBuildToolsInstallerPath()).toEqual({
      directory: 'C:\\workDir',
      fileName: 'vs_BuildTools.exe',
      logPath: null,
      path: 'C:\\workDir\\vs_BuildTools.exe',
      url: 'https://download.visualstudio.microsoft.com/download/pr/befdb1f9-8676-4693-b031-65ee44835915/fc7680c10773759e4522f5c1ca2ce07fd01f61d7b9efa68b346c0b0da6a0b125/vs_BuildTools.exe',
    });

    delete process.env.npm_config_vs2017;
  });
});
