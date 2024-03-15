import { makeSample } from 'test/factories/sample.factory';

describe('Sample', () => {
  it('should be able to define Sample', () => {
    expect(makeSample()).toBeDefined();
  });
});
