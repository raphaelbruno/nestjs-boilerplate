import { Role } from './role';
import { User } from './user';

describe('User', () => {
  it('should be able to define User', () => {
    expect(new User()).toBeDefined();
  });

  it('should be Super User', () => {
    const user = new User({
      roles: [new Role({ title: 'Admin', key: 'ADMIN', level: 0 })],
    });
    expect(user.isSuperUser()).toBe(true);
  });

  it('should be able to get greater role', () => {
    const user = new User({
      roles: [
        new Role({ title: 'User', key: 'USER', level: 1 }),
        new Role({ title: 'User', key: 'USER', level: 2 }),
      ],
    });
    expect(user.getGreaterRole()).toMatchObject({ level: 1 });
  });

  it('should not be Super User', () => {
    const user = new User({
      roles: [
        new Role({ title: 'User', key: 'USER', level: 1 }),
        new Role({ title: 'User', key: 'USER', level: 2 }),
      ],
    });
    expect(user.isSuperUser()).toBe(false);
  });

  it('should be able to fill can manage field', () => {
    const user = new User({
      id: 1,
      roles: [new Role({ title: 'User', key: 'USER', level: 1 })],
    });

    expect(
      user.fillCanManageField(
        new User({ id: 1, roles: [new Role({ level: 99 })] }),
      ),
    ).toBe(true);
    expect(
      user.fillCanManageField(
        new User({ id: 2, roles: [new Role({ level: 0 })] }),
      ),
    ).toBe(true);
    expect(
      user.fillCanManageField(
        new User({ id: 2, roles: [new Role({ level: 1 })] }),
      ),
    ).toBe(false);
    expect(
      user.fillCanManageField(
        new User({ id: 2, roles: [new Role({ level: 2 })] }),
      ),
    ).toBe(false);
  });
});
