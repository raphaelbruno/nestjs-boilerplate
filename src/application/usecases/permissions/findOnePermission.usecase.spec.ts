import { makePermission } from 'test/factories/permission.factory';
import { PermissionsInMemoryRepository } from 'test/repositories/permissions.database';
import { FindOnePermissionUseCase } from './findOnePermission.usecase';

describe('FindOnePermissionUseCase', () => {
  let inMemoryRepository: PermissionsInMemoryRepository;
  let useCase: FindOnePermissionUseCase;

  beforeAll(async () => {
    inMemoryRepository = new PermissionsInMemoryRepository();
    useCase = new FindOnePermissionUseCase(inMemoryRepository);
  });

  it('should find one Permission', async () => {
    for (let i = 0; i < 5; i++)
      await inMemoryRepository.create(
        makePermission({ id: i + 1, deletedAt: null }),
      );

    expect(await useCase.execute(1)).not.toBeNull();
    expect(await useCase.execute(5)).not.toBeNull();
    await expect(useCase.execute(10)).rejects.toThrow();
  });
});
