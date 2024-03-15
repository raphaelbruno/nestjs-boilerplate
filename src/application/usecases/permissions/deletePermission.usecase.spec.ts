import { makePermission } from 'test/factories/permission.factory';
import { PermissionsInMemoryRepository } from 'test/repositories/permissions.database';
import { DeletePermissionUseCase } from './deletePermission.usecase';

describe('DeletePermissionUseCase', () => {
  let inMemoryRepository: PermissionsInMemoryRepository;
  let useCase: DeletePermissionUseCase;

  beforeAll(async () => {
    inMemoryRepository = new PermissionsInMemoryRepository();
    useCase = new DeletePermissionUseCase(inMemoryRepository);
  });

  it('should delete a Permission', async () => {
    const item = makePermission({ deletedAt: null });
    await inMemoryRepository.create(item);

    expect(await useCase.execute(item.id)).toBe(true);
    expect((await inMemoryRepository.findAll()).data).toHaveLength(0);
  });
});
