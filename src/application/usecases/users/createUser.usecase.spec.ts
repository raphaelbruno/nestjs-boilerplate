import { makeUser } from 'test/factories/user.factory';
import { UsersInMemoryRepository } from 'test/repositories/users.database';
import { CreateUserUseCase } from './createUser.usecase';

describe('CreateUserUseCase', () => {
  let inMemoryRepository: UsersInMemoryRepository;
  let useCase: CreateUserUseCase;

  beforeAll(async () => {
    inMemoryRepository = new UsersInMemoryRepository();
    useCase = new CreateUserUseCase(inMemoryRepository);
  });

  it('should create a User', async () => {
    const item = await useCase.execute(makeUser({ deletedAt: null }));
    expect(item).not.toBeNull();
  });
});
