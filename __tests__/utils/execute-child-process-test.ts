import { spawn } from 'child_process';
import { executeChildProcess } from '../../src/utils/execute-child-process';
import { mockSpawnChild, mockSpawnError, mockSpawnOk } from '../test-utils';

jest.mock('child_process', () => ({ spawn: jest.fn()}));

describe('execute-child-process', () => {
  it('resolves the promise if the child exits with code 0', async () => {
    (spawn as any).mockImplementation(mockSpawnOk);

    await executeChildProcess('fake', []);
  });

  it('rejects the promise if the child exits with code 1', async () => {
    (spawn as any).mockImplementation(mockSpawnError);

    const expectedError = new Error('fake exited with code: 1');

    return expect(executeChildProcess('fake', [])).rejects.toEqual(expectedError);
  });
});
