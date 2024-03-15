import { Auth } from './auth';
import { User } from './user';

describe('Auth Model', () => {
  it('should be able to define Auth', () => {
    const auth = new Auth();
    expect(auth).toBeInstanceOf(Auth);
  });

  it('should be able to define Auth with data', () => {
    const auth = new Auth({
      user: new User(),
      access_token: 'any_token',
    });
    expect(auth).toBeInstanceOf(Auth);
    expect(auth.user).toBeInstanceOf(User);
    expect(auth.access_token).toBe('any_token');
  });
});
