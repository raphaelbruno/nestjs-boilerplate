import { User } from 'src/domain/models/user';
import { makeRole } from 'test/factories/role.factory';
import { makeUser } from 'test/factories/user.factory';
import { UsersInMemoryRepository } from 'test/repositories/users.database';
import { DeleteUserUseCase } from './deleteUser.usecase';

describe('DeleteUserUseCase', () => {
  let inMemoryRepository: UsersInMemoryRepository;
  let useCase: DeleteUserUseCase;
  let user: User;

  beforeAll(async () => {
    inMemoryRepository = new UsersInMemoryRepository();
    useCase = new DeleteUserUseCase(inMemoryRepository);
    user = makeUser({ roles: [makeRole({ level: 0 })], deletedAt: null });
  });

  it('should delete a User', async () => {
    const item = makeUser({ deletedAt: null });
    await inMemoryRepository.create(item);

    expect(await useCase.execute(user, item.id)).toBe(true);
    expect((await inMemoryRepository.findAll()).data).toHaveLength(0);
  });
});
