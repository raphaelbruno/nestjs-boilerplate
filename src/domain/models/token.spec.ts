import { Token } from './token';

describe('Token', () => {
  it('should be able to define Token', () => {
    expect(new Token()).toBeDefined();
  });
});
