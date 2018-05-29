import * as fs from 'fs-extra';
import { getWorkDirectory } from '../../src/utils/get-work-dir';

jest.mock('fs-extra', () => ({
  ensureDirSync: jest.fn()
}));

describe('get-work-dir', () => {
  it('returns a working directory and ensures it exists', () => {
    expect(getWorkDirectory()).toBeDefined();
    expect(fs.ensureDirSync).toHaveBeenCalledTimes(1);
  });
});
