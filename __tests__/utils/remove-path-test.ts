import { removePath } from '../../src/utils/remove-path';

describe('removePath', () => {
  it('removes the path', () => {
    process.env.PATH = process.env.path = 'hi';

    removePath();

    expect(process.env.PATH).toBeUndefined();
    expect(process.env.path).toBeUndefined();
  });
});
