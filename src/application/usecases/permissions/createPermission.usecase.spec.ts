import { makePermission } from 'test/factories/permission.factory';
import { PermissionsInMemoryRepository } from 'test/repositories/permissions.database';
import { CreatePermissionUseCase } from './createPermission.usecase';

describe('CreatePermissionUseCase', () => {
  let inMemoryRepository: PermissionsInMemoryRepository;
  let useCase: CreatePermissionUseCase;

  beforeAll(async () => {
    inMemoryRepository = new PermissionsInMemoryRepository();
    useCase = new CreatePermissionUseCase(inMemoryRepository);
  });

  it('should create a Permission', async () => {
    const item = await useCase.execute(makePermission({ deletedAt: null }));
    expect(item).not.toBeNull();
  });
});
