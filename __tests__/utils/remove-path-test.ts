import { removePath } from '../../src/utils/remove-path';

describe('removePath', () => {
  it('removes the path', () => {
    process.env.PATH = process.env.path = 'hi';

    removePath();

    // process.env.path is weird and we
    // need a weird test for it
    Object.keys(process.env).forEach((k) => {
      expect(k !== 'PATH').toBe(true);
      expect(k !== 'path').toBe(true);
    });
  });
});
