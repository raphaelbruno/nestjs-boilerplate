import { User } from 'src/domain/models/user';
import { makeRole } from 'test/factories/role.factory';
import { makeUser } from 'test/factories/user.factory';
import { RolesInMemoryRepository } from 'test/repositories/roles.database';
import { DeleteRoleUseCase } from './deleteRole.usecase';

describe('DeleteRoleUseCase', () => {
  let inMemoryRepository: RolesInMemoryRepository;
  let useCase: DeleteRoleUseCase;
  let user: User;

  beforeAll(async () => {
    inMemoryRepository = new RolesInMemoryRepository();
    useCase = new DeleteRoleUseCase(inMemoryRepository);
    user = makeUser({ roles: [makeRole({ level: 0 })], deletedAt: null });
  });

  it('should delete a Role', async () => {
    const item = makeRole({ deletedAt: null });
    await inMemoryRepository.create(item);

    expect(await useCase.execute(user, item.id)).toBe(true);
    expect((await inMemoryRepository.findAll()).data).toHaveLength(0);
  });
});
