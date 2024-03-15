import { comparePasswordHash, generatePasswordHash } from './security.helper';

describe('SecurityHelper', () => {
  it('should generate a password hash', async () => {
    const password = 'password';
    const hash = await generatePasswordHash(password);
    expect(hash).not.toBe(password);
    expect(await comparePasswordHash(password, hash)).toBe(true);
  });

  it('should compare a password hash', async () => {
    const password = 'password';
    const hash = await generatePasswordHash(password);
    expect(await comparePasswordHash(password, hash)).toBe(true);
    expect(await comparePasswordHash('wrong', hash)).toBe(false);
  });
});
