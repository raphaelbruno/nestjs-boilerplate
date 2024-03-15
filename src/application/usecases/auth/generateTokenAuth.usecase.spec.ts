import { Auth } from 'src/domain/models/auth';
import { TokenRepositoryInterface } from 'src/domain/repositories/token.interface';
import { UsersRepositoryInterface } from 'src/domain/repositories/users.interface';
import { makeUser } from 'test/factories/user.factory';
import { TokenInMemoryRepository } from 'test/repositories/token.repository';
import { UsersInMemoryRepository } from 'test/repositories/users.database';
import { GenerateTokenAuthUseCase } from './generateTokenAuth.usecase';

describe('GenerateTokenAuthUseCase', () => {
  let inMemoryRepository: UsersRepositoryInterface;
  let tokenRepository: TokenRepositoryInterface;
  let useCase: GenerateTokenAuthUseCase;

  beforeAll(async () => {
    inMemoryRepository = new UsersInMemoryRepository();
    tokenRepository = new TokenInMemoryRepository();
    useCase = new GenerateTokenAuthUseCase(inMemoryRepository, tokenRepository);
  });

  it('should return a token when the user is found', async () => {
    const user = makeUser({ deletedAt: null });
    await inMemoryRepository.create(user);

    expect(await useCase.execute(user.id)).toBeInstanceOf(Auth);
  });

  it('should throw an error when the user is not found', async () => {
    await expect(useCase.execute(0)).rejects.toThrow();
  });

  it('should throw an error when the user is deleted', async () => {
    const user = makeUser({ deletedAt: new Date() });
    await inMemoryRepository.create(user);

    await expect(useCase.execute(user.id)).rejects.toThrow();
  });
});
