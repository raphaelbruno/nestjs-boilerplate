import { makeRole } from 'test/factories/role.factory';
import { RolesInMemoryRepository } from 'test/repositories/roles.database';
import { FindOneRoleUseCase } from './findOneRole.usecase';
import { User } from 'src/domain/models/user';
import { makeUser } from 'test/factories/user.factory';

describe('FindOneRoleUseCase', () => {
  let inMemoryRepository: RolesInMemoryRepository;
  let useCase: FindOneRoleUseCase;
  let user: User;

  beforeAll(async () => {
    inMemoryRepository = new RolesInMemoryRepository();
    useCase = new FindOneRoleUseCase(inMemoryRepository);
    user = makeUser({ roles: [makeRole({ level: 0 })], deletedAt: null });
  });

  it('should find one Role', async () => {
    for (let i = 0; i < 5; i++)
      await inMemoryRepository.create(makeRole({ id: i + 1, deletedAt: null }));

    expect(await useCase.execute(user, 1)).not.toBeNull();
    expect(await useCase.execute(user, 5)).not.toBeNull();
    await expect(useCase.execute(user, 10)).rejects.toThrow();
  });
});
