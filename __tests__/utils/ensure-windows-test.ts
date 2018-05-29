import { ensureWindows } from '../../src/utils/ensure-windows';
import { mockPlatform, mockProcessProp, resetPlatform } from '../test-utils';

describe('ensure-windows', () => {
  const oldExit = process.exit;

  beforeEach(() => {
    mockProcessProp('exit', jest.fn());
  });

  afterEach(() => {
    resetPlatform();
    mockProcessProp('exit', oldExit);
  });

  it('exits on macOS', () => {
    mockPlatform('darwin');

    ensureWindows();

    expect(process.exit).toHaveBeenCalled();
  });

  it('exits on Linux', () => {
    mockPlatform('linux');

    ensureWindows();

    expect(process.exit).toHaveBeenCalled();
  });

  it('does not exit on Windows', () => {
    mockPlatform('win32');

    ensureWindows();

    expect(process.exit).toHaveBeenCalledTimes(0);
  });
});
