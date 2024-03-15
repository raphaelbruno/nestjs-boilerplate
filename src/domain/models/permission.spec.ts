import { Permission } from './permission';

describe('Permission', () => {
  it('should be able to define Permission', () => {
    expect(new Permission()).toBeDefined();
  });
});
