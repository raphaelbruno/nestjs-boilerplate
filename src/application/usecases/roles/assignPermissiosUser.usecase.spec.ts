import { User } from 'src/domain/models/user';
import { makePermission } from 'test/factories/permission.factory';
import { makeRole } from 'test/factories/role.factory';
import { makeUser } from 'test/factories/user.factory';
import { PermissionsInMemoryRepository } from 'test/repositories/permissions.database';
import { RolesInMemoryRepository } from 'test/repositories/roles.database';
import { AssignPermissionsRoleUseCase } from './assignPermissionsUser.usecase';

describe('ChangePasswordUserUseCase', () => {
  let inMemoryRepository: RolesInMemoryRepository;
  let permissionsInMemoryRepository: PermissionsInMemoryRepository;
  let useCase: AssignPermissionsRoleUseCase;
  let user: User;

  beforeAll(async () => {
    inMemoryRepository = new RolesInMemoryRepository();
    permissionsInMemoryRepository = new PermissionsInMemoryRepository();
    useCase = new AssignPermissionsRoleUseCase(
      inMemoryRepository,
      permissionsInMemoryRepository,
    );
    user = makeUser({ roles: [makeRole({ level: 0 })], deletedAt: null });
  });

  it('should add a permission to a User', async () => {
    const permission =
      await permissionsInMemoryRepository.create(makePermission());
    const item = await inMemoryRepository.create(makeRole({ deletedAt: null }));

    const editedItem = await useCase.execute(user, item.id, [permission.id]);

    expect(editedItem.permissions).toHaveLength(1);
  });

  it('should remove a permission to a User', async () => {
    const permission =
      await permissionsInMemoryRepository.create(makePermission());
    const item = await inMemoryRepository.create(
      makeRole({ deletedAt: null, permissions: [permission] }),
    );

    const editedItem = await useCase.execute(user, item.id, []);

    expect(editedItem.permissions).toHaveLength(0);
  });
});
