import { spawnSync } from 'child_process';

export function getIsPythonInstalled() {
  try {
    const options = { windowsHide: true, stdio: null };
    const { output } = spawnSync('python', [ '-V' ], options as any);
    const version = output.toString().trim().replace(/,/g, '');

    if (version && version.includes(' 2.')) {
      return version;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
