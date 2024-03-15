import { User } from 'src/domain/models/user';
import { makeRole } from 'test/factories/role.factory';
import { makeUser } from 'test/factories/user.factory';
import { UsersInMemoryRepository } from 'test/repositories/users.database';
import { UpdateUserUseCase } from './updateUser.usecase';

describe('UpdateUserUseCase', () => {
  let inMemoryRepository: UsersInMemoryRepository;
  let useCase: UpdateUserUseCase;
  let user: User;

  beforeAll(async () => {
    inMemoryRepository = new UsersInMemoryRepository();
    useCase = new UpdateUserUseCase(inMemoryRepository);
    user = makeUser({ roles: [makeRole({ level: 0 })], deletedAt: null });
  });

  it('should update a User', async () => {
    const item = await inMemoryRepository.create(makeUser({ deletedAt: null }));
    const editedItem = await useCase.execute(
      user,
      new User({ ...item, email: 'email@localhost.net' }),
    );

    expect(editedItem.email).toBe('email@localhost.net');
  });
});
