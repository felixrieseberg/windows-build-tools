const savedPath = process.env.Path;

/**
 * This patches npm bug https://github.com/npm/npm-lifecycle/issues/20,
 * which added more PATH variables than were allowed.
 *
 * @returns {void}
 */
export function removePath(): void {
  Object.defineProperty(process.env, 'PATH', { value: undefined });
  Object.defineProperty(process.env, 'path', { value: undefined });

  delete process.env.PATH;
  delete process.env.path;

  process.env.Path = savedPath;
}
