import { makeRole } from 'test/factories/role.factory';
import { RolesInMemoryRepository } from 'test/repositories/roles.database';
import { CreateRoleUseCase } from './createRole.usecase';
import { User } from 'src/domain/models/user';
import { makeUser } from 'test/factories/user.factory';

describe('CreateRoleUseCase', () => {
  let inMemoryRepository: RolesInMemoryRepository;
  let useCase: CreateRoleUseCase;
  let user: User;

  beforeAll(async () => {
    inMemoryRepository = new RolesInMemoryRepository();
    useCase = new CreateRoleUseCase(inMemoryRepository);
    user = makeUser({ roles: [makeRole({ level: 0 })], deletedAt: null });
  });

  it('should create a Role', async () => {
    const item = await useCase.execute(user, makeRole({ deletedAt: null }));
    expect(item).not.toBeNull();
  });
});
