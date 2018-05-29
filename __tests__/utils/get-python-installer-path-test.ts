import { getPythonInstallerPath } from '../../src/utils/get-python-installer-path';

jest.mock('../../src/utils/get-work-dir', () => ({
  getWorkDirectory: jest.fn(() => 'C:\\workDir')
}));

jest.mock('../../src/utils/get-is-python-installed', () => ({
  getIsPythonInstalled: jest.fn(() => null)
}));

describe('getPythonInstallerPath', () => {
  it('gets the correct information', () => {
    const amd64 = process.arch === 'x64' ? 'amd64.' : '';

    expect(getPythonInstallerPath()).toEqual({
      directory: 'C:\\workDir',
      fileName: `python-2.7.14.${amd64}msi`,
      logPath: 'C:\\workDir\\python-log.txt',
      path: `C:\\workDir\\python-2.7.14.${amd64}msi`,
      targetPath: 'C:\\workDir\\python27',
      url: `https://www.python.org/ftp/python/2.7.14/python-2.7.14.${amd64}msi`,
    });
  });
});
