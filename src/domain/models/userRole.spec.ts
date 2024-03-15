import { UserRole } from './userRole';

describe('User', () => {
  it('should be able to define User', () => {
    expect(new UserRole()).toBeDefined();
  });
});
