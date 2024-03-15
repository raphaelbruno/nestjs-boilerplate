import { RolePermission } from './rolePermission';

describe('User', () => {
  it('should be able to define User', () => {
    expect(new RolePermission()).toBeDefined();
  });
});
