import { makeRole } from 'test/factories/role.factory';
import { makeUser } from 'test/factories/user.factory';
import { RolesInMemoryRepository } from 'test/repositories/roles.database';
import { UsersInMemoryRepository } from 'test/repositories/users.database';
import { AssignRolesUserUseCase } from './assignRolesUser.usecase';
import { User } from 'src/domain/models/user';

describe('ChangePasswordUserUseCase', () => {
  let inMemoryRepository: UsersInMemoryRepository;
  let rolesInMemoryRepository: RolesInMemoryRepository;
  let useCase: AssignRolesUserUseCase;
  let user: User;

  beforeAll(async () => {
    inMemoryRepository = new UsersInMemoryRepository();
    rolesInMemoryRepository = new RolesInMemoryRepository();
    useCase = new AssignRolesUserUseCase(
      inMemoryRepository,
      rolesInMemoryRepository,
    );
    user = makeUser({ roles: [makeRole({ level: 0 })], deletedAt: null });
  });

  it('should add a role to a User', async () => {
    const role = await rolesInMemoryRepository.create(
      makeRole({ canManage: true }),
    );
    const item = await inMemoryRepository.create(makeUser({ deletedAt: null }));

    const editedItem = await useCase.execute(user, item.id, [role.id]);

    expect(editedItem.roles).toHaveLength(1);
  });

  it('should remove a role to a User', async () => {
    const role = await rolesInMemoryRepository.create(
      makeRole({ canManage: true }),
    );
    const item = await inMemoryRepository.create(
      makeUser({ deletedAt: null, roles: [role] }),
    );

    const editedItem = await useCase.execute(user, item.id, []);

    expect(editedItem.roles).toHaveLength(0);
  });
});
