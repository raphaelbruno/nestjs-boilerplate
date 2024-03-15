import { comparePasswordHash } from 'src/application/helpers/security.helper';
import { User } from 'src/domain/models/user';
import { makeUser } from 'test/factories/user.factory';
import { UsersInMemoryRepository } from 'test/repositories/users.database';
import { ChangePasswordUserUseCase } from './changePasswordUser.usecase';
import { makeRole } from 'test/factories/role.factory';

describe('ChangePasswordUserUseCase', () => {
  let inMemoryRepository: UsersInMemoryRepository;
  let useCase: ChangePasswordUserUseCase;
  let user: User;

  beforeAll(async () => {
    inMemoryRepository = new UsersInMemoryRepository();
    useCase = new ChangePasswordUserUseCase(inMemoryRepository);
    user = makeUser({ roles: [makeRole({ level: 0 })], deletedAt: null });
  });

  it('should change the password of a User', async () => {
    const item = await inMemoryRepository.create(makeUser({ deletedAt: null }));
    const editedItem = await useCase.execute(user, item.id, 'password');

    expect(await comparePasswordHash('password', editedItem.password)).toBe(
      true,
    );
  });
});
