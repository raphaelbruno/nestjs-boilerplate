import { User } from 'src/domain/models/user';
import { makeRole, makeRoleList } from 'test/factories/role.factory';
import { makeUser } from 'test/factories/user.factory';
import { RolesInMemoryRepository } from 'test/repositories/roles.database';
import { FindAllRolesUseCase } from './findAllRoles.usecase';

describe('FindAllRolesUseCase', () => {
  let inMemoryRepository: RolesInMemoryRepository;
  let useCase: FindAllRolesUseCase;
  let user: User;

  beforeAll(async () => {
    inMemoryRepository = new RolesInMemoryRepository();
    useCase = new FindAllRolesUseCase(inMemoryRepository);
    user = makeUser({ roles: [makeRole({ level: 0 })], deletedAt: null });
  });

  it('should find all Roles', async () => {
    for (const role of makeRoleList(5, { deletedAt: null }))
      await inMemoryRepository.create(role);

    expect((await useCase.execute(user)).data).toHaveLength(5);
  });
});
