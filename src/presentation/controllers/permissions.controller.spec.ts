import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePermissionUseCase } from 'src/application/usecases/permissions/createPermission.usecase';
import { DeletePermissionUseCase } from 'src/application/usecases/permissions/deletePermission.usecase';
import { FindAllPermissionsUseCase } from 'src/application/usecases/permissions/findAllPermissions.usecase';
import { FindOnePermissionUseCase } from 'src/application/usecases/permissions/findOnePermission.usecase';
import { UpdatePermissionUseCase } from 'src/application/usecases/permissions/updatePermission.usecase';
import { PermissionsRepositoryInterface } from 'src/domain/repositories/permissions.interface';
import { makePermission } from 'test/factories/permission.factory';
import { PermissionsInMemoryRepository } from 'test/repositories/permissions.database';
import { PaginatedResponse } from '../schemas/paginated.schema';
import { PermissionResponse } from '../schemas/permission.schema';
import { PermissionsController } from './permissions.controller';

describe('PermissionsController', () => {
  let controller: PermissionsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        FindAllPermissionsUseCase,
        FindOnePermissionUseCase,
        CreatePermissionUseCase,
        UpdatePermissionUseCase,
        DeletePermissionUseCase,
        {
          provide: PermissionsRepositoryInterface,
          useClass: PermissionsInMemoryRepository,
        },
      ],
    }).compile();

    controller = app.get<PermissionsController>(PermissionsController);
  });

  describe('root', () => {
    it('should return paginated permissions from findAll function', async () => {
      const listAll = await controller.findAll();
      expect(listAll).toBeInstanceOf(PaginatedResponse<PermissionResponse>);
    });

    it('should return a permission from findOne function', async () => {
      const item = makePermission({ deletedAt: null });
      await controller.create(item);
      const response = await controller.findOne(item.id);

      expect(response).toBeInstanceOf(PermissionResponse);
      expect(response).not.toHaveProperty('updatedAt');
      expect(response).not.toHaveProperty('deletedAt');
      expect(response).toMatchObject({
        id: item.id,
        title: item.title,
      });
      await expect(controller.findOne(0)).rejects.toThrow(HttpException);
    });

    it('should create a permission from create function', async () => {
      const item = makePermission({ deletedAt: null });
      const response = await controller.create(item);

      expect(response).toBeInstanceOf(PermissionResponse);
      expect(response).not.toHaveProperty('updatedAt');
      expect(response).not.toHaveProperty('deletedAt');
      expect(response).toMatchObject({
        id: item.id,
        title: item.title,
      });
    });

    it('should update a permission from update function', async () => {
      const item = makePermission({ deletedAt: null });
      await controller.create(item);
      const response = await controller.update(item.id, item);

      expect(response).toBeInstanceOf(PermissionResponse);
      expect(response).not.toHaveProperty('updatedAt');
      expect(response).not.toHaveProperty('deletedAt');
      expect(response).toMatchObject({
        id: item.id,
        title: item.title,
      });
    });

    it('should delete a permission from delete function', async () => {
      const item = makePermission({ id: 1, deletedAt: null });
      await controller.create(item);

      expect(await controller.delete(item.id)).toBeNull();
      await expect(controller.delete(0)).rejects.toThrow(HttpException);
    });
  });
});
