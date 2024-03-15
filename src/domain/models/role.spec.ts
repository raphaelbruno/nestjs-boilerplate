import { Role } from './role';
import { User } from './user';

describe('Role', () => {
  it('should be able to define Role', () => {
    expect(new Role()).toBeDefined();
  });

  it('should be able to fill can manage field', () => {
    const role = new Role({
      id: 1,
      permissions: [],
    });

    expect(
      role.fillCanManageField(
        new User({ id: 2, roles: [new Role({ level: 0 })] }),
      ),
    ).toBe(true);
    expect(
      role.fillCanManageField(
        new User({ id: 2, roles: [new Role({ level: 1 })] }),
      ),
    ).toBe(false);
    expect(
      role.fillCanManageField(
        new User({ id: 2, roles: [new Role({ level: 2 })] }),
      ),
    ).toBe(false);
  });
});
