import { spawn } from 'child_process';

/**
 * Starts a child process using the provided executable
 *
 * @param fileName - Path to the executable to start
 */
export function executeChildProcess(fileName: string, args: Array<any>): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(fileName, args);

    child.on('exit', (code) => {
      if (code !== 0) {
        return reject(new Error(fileName + ' exited with code: ' + code));
      }

      return resolve();
    });

    child.stdin.end();
  });
}
