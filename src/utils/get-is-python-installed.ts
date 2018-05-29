import { spawnSync } from 'child_process';

let _isPythonInstalled: string | null | undefined;

export function getIsPythonInstalled() {
  if (_isPythonInstalled !== undefined) return _isPythonInstalled;

  try {
    const options = { windowsHide: true, stdio: null };
    const { output } = spawnSync('python', [ '-V' ], options as any);
    const version = output.toString().trim().replace(/,/g, '');

    if (version && version.includes(' 2.')) {
      return _isPythonInstalled = version;
    } else {
      return _isPythonInstalled = null;
    }
  } catch (error) {
    return _isPythonInstalled = null;
  }
}
