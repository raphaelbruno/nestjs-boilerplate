import { makePermission } from 'test/factories/permission.factory';
import { PermissionsInMemoryRepository } from 'test/repositories/permissions.database';
import { UpdatePermissionUseCase } from './updatePermission.usecase';
import { Permission } from 'src/domain/models/permission';

describe('UpdatePermissionUseCase', () => {
  let inMemoryRepository: PermissionsInMemoryRepository;
  let useCase: UpdatePermissionUseCase;

  beforeAll(async () => {
    inMemoryRepository = new PermissionsInMemoryRepository();
    useCase = new UpdatePermissionUseCase(inMemoryRepository);
  });

  it('should update a Permission', async () => {
    const item = await inMemoryRepository.create(
      makePermission({ deletedAt: null }),
    );
    const editedItem = await useCase.execute(
      new Permission({
        ...item,
        title: 'Edited Permission',
        key: 'EDITED_PERMISSION',
      }),
    );

    expect(editedItem.title).toBe('Edited Permission');
    expect(editedItem.key).toBe('EDITED_PERMISSION');
  });
});
