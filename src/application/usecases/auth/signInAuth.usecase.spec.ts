import { makeUser } from 'test/factories/user.factory';
import { UsersInMemoryRepository } from 'test/repositories/users.database';
import { SignInAuthUseCase } from './SignInAuth.usecase';
import { TokenInMemoryRepository } from 'test/repositories/token.repository';
import { Auth } from 'src/domain/models/auth';

describe('ValidateUserAuthUseCase', () => {
  let inMemoryRepository: UsersInMemoryRepository;
  let tokenRepository: TokenInMemoryRepository;
  let useCase: SignInAuthUseCase;

  beforeAll(async () => {
    inMemoryRepository = new UsersInMemoryRepository();
    tokenRepository = new TokenInMemoryRepository();
    useCase = new SignInAuthUseCase(inMemoryRepository, tokenRepository);
  });

  it('should return a auth when the user is found', async () => {
    const user = makeUser({ deletedAt: null });
    await inMemoryRepository.create(user);

    expect(await useCase.execute(user.email, user.password)).toBeInstanceOf(
      Auth,
    );
  });

  it('should throw an error when the user is not found', async () => {
    await expect(useCase.execute('username', 'password')).rejects.toThrow();
  });

  it('should throw an error when the password is incorrect', async () => {
    const user = makeUser({ deletedAt: null });
    await inMemoryRepository.create(user);

    await expect(useCase.execute(user.email, 'password')).rejects.toThrow();
  });

  it('should throw an error when the user is deleted', async () => {
    const user = makeUser({ deletedAt: new Date() });
    await inMemoryRepository.create(user);

    await expect(useCase.execute(user.email, user.password)).rejects.toThrow();
  });
});
