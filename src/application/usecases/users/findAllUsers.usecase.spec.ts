import { makeUser, makeUserList } from 'test/factories/user.factory';
import { UsersInMemoryRepository } from 'test/repositories/users.database';
import { FindAllUsersUseCase } from './findAllUsers.usecase';
import { User } from 'src/domain/models/user';
import { makeRole } from 'test/factories/role.factory';

describe('FindAllUsersUseCase', () => {
  let inMemoryRepository: UsersInMemoryRepository;
  let useCase: FindAllUsersUseCase;
  let user: User;

  beforeAll(async () => {
    inMemoryRepository = new UsersInMemoryRepository();
    useCase = new FindAllUsersUseCase(inMemoryRepository);
    user = makeUser({ roles: [makeRole({ level: 0 })], deletedAt: null });
  });

  it('should find all Users', async () => {
    for (const user of makeUserList(5, { deletedAt: null }))
      await inMemoryRepository.create(user);

    expect((await useCase.execute(user)).data).toHaveLength(5);
  });
});
