import { makeUser } from 'test/factories/user.factory';
import { UsersInMemoryRepository } from 'test/repositories/users.database';
import { FindOneUserUseCase } from './findOneUser.usecase';
import { User } from 'src/domain/models/user';
import { makeRole } from 'test/factories/role.factory';

describe('FindOneUserUseCase', () => {
  let inMemoryRepository: UsersInMemoryRepository;
  let useCase: FindOneUserUseCase;
  let user: User;

  beforeAll(async () => {
    inMemoryRepository = new UsersInMemoryRepository();
    useCase = new FindOneUserUseCase(inMemoryRepository);
    user = makeUser({ roles: [makeRole({ level: 0 })], deletedAt: null });
  });

  it('should find one User', async () => {
    for (let i = 0; i < 5; i++) {
      await inMemoryRepository.create(makeUser({ id: i + 1, deletedAt: null }));
    }

    expect(await useCase.execute(user, 1)).not.toBeNull();
    expect(await useCase.execute(user, 5)).not.toBeNull();
    await expect(useCase.execute(user, 10)).rejects.toThrow();
  });
});
