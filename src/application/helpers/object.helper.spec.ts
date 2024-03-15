import { User } from 'src/domain/models/user';
import { objectToPlain } from './object.helper';
import { Role } from 'src/domain/models/role';

describe('objectToPlain', () => {
  it('should return a plain object', () => {
    const object = new User({ id: 1, email: 'email@localhost' });
    const plain = objectToPlain(object);

    expect(object).toBeInstanceOf(User);
    expect(plain).toBeInstanceOf(Object);
    expect(plain).toMatchObject(object);
  });

  it('should return a plain object from nested objects', () => {
    const object = new User({
      id: 1,
      email: 'email@localhost',
      roles: [new Role({ id: 1, title: 'Role', key: 'ROLE' })],
    });
    const plain = objectToPlain(object);

    expect(object).toBeInstanceOf(User);
    expect(plain).toBeInstanceOf(Object);
    expect(plain).toMatchObject(object);
  });
});
