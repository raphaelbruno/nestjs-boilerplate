import { Role } from 'src/domain/models/role';
import { User } from 'src/domain/models/user';
import { makeRole } from 'test/factories/role.factory';
import { makeUser } from 'test/factories/user.factory';
import { RolesInMemoryRepository } from 'test/repositories/roles.database';
import { UpdateRoleUseCase } from '../roles/updateRole.usecase';

describe('UpdateRoleUseCase', () => {
  let inMemoryRepository: RolesInMemoryRepository;
  let useCase: UpdateRoleUseCase;
  let user: User;

  beforeAll(async () => {
    inMemoryRepository = new RolesInMemoryRepository();
    useCase = new UpdateRoleUseCase(inMemoryRepository);
    user = makeUser({ roles: [makeRole({ level: 0 })], deletedAt: null });
  });

  it('should update a Role', async () => {
    const item = await inMemoryRepository.create(makeRole({ deletedAt: null }));
    const editedItem = await useCase.execute(
      user,
      new Role({ ...item, title: 'Edited Role', key: 'EDITED_ROLE' }),
    );

    expect(editedItem.title).toBe('Edited Role');
    expect(editedItem.key).toBe('EDITED_ROLE');
  });
});
