import { spawnSync } from 'child_process';

jest.mock('child_process', () => ({ spawnSync: jest.fn()}));

describe('get-is-python-installed', () => {
  let getIsPythonInstalled: any;

  beforeEach(() => {
    ({ getIsPythonInstalled } = require('../../src/utils/get-is-python-installed'));
    jest.resetModules();
  });

  it('correctly returns the Python version if installed', async () => {
    (spawnSync as any).mockReturnValue({ output: '\nPython 2.7.15\n' });

    expect(getIsPythonInstalled()).toBe('Python 2.7.15');
  });

  it('correctly returns the Python version if installed', async () => {
    (spawnSync as any).mockImplementation(() => {
      throw new Error('No!');
    });

    expect(getIsPythonInstalled()).toBeNull();
  });
});
