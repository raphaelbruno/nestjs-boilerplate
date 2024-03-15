import { makePermissionList } from 'test/factories/permission.factory';
import { PermissionsInMemoryRepository } from 'test/repositories/permissions.database';
import { FindAllPermissionsUseCase } from './findAllPermissions.usecase';

describe('FindAllPermissionsUseCase', () => {
  let inMemoryRepository: PermissionsInMemoryRepository;
  let useCase: FindAllPermissionsUseCase;

  beforeAll(async () => {
    inMemoryRepository = new PermissionsInMemoryRepository();
    useCase = new FindAllPermissionsUseCase(inMemoryRepository);
  });

  it('should find all Permissions', async () => {
    for (const permission of makePermissionList(5, { deletedAt: null }))
      await inMemoryRepository.create(permission);

    expect((await useCase.execute()).data).toHaveLength(5);
  });
});
