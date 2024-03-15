import { Test, TestingModule } from '@nestjs/testing';
import { AssignPermissionsRoleUseCase } from 'src/application/usecases/roles/assignPermissionsUser.usecase';
import { CreateRoleUseCase } from 'src/application/usecases/roles/createRole.usecase';
import { DeleteRoleUseCase } from 'src/application/usecases/roles/deleteRole.usecase';
import { FindAllRolesUseCase } from 'src/application/usecases/roles/findAllRoles.usecase';
import { FindOneRoleUseCase } from 'src/application/usecases/roles/findOneRole.usecase';
import { UpdateRoleUseCase } from 'src/application/usecases/roles/updateRole.usecase';
import { PermissionsRepositoryInterface } from 'src/domain/repositories/permissions.interface';
import { RolesRepositoryInterface } from 'src/domain/repositories/roles.interface';
import { makeRole } from 'test/factories/role.factory';
import { makeUser } from 'test/factories/user.factory';
import { PermissionsInMemoryRepository } from 'test/repositories/permissions.database';
import { RolesInMemoryRepository } from 'test/repositories/roles.database';
import { PaginatedResponse } from '../schemas/paginated.schema';
import { RoleResponse } from '../schemas/role.schema';
import { RolesController } from './roles.controller';
import { HttpException } from '@nestjs/common';

describe('RolesController', () => {
  let controller: RolesController;
  let user;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        FindAllRolesUseCase,
        FindOneRoleUseCase,
        CreateRoleUseCase,
        UpdateRoleUseCase,
        DeleteRoleUseCase,
        AssignPermissionsRoleUseCase,
        {
          provide: RolesRepositoryInterface,
          useClass: RolesInMemoryRepository,
        },
        {
          provide: PermissionsRepositoryInterface,
          useClass: PermissionsInMemoryRepository,
        },
      ],
    }).compile();

    controller = app.get<RolesController>(RolesController);
    user = makeUser({
      roles: [makeRole({ deletedAt: null, level: 0 })],
      deletedAt: null,
    });
  });

  describe('root', () => {
    it('should return paginated roles from findAll function', async () => {
      const listAll = await controller.findAll({ user: user });
      expect(listAll).toBeInstanceOf(PaginatedResponse<RoleResponse>);
    });

    it('should return a role from findOne function', async () => {
      const item = makeRole({ deletedAt: null });
      await controller.create({ user: user }, item);
      const response = await controller.findOne({ user: user }, item.id);

      expect(response).toBeInstanceOf(RoleResponse);
      expect(response).not.toHaveProperty('updatedAt');
      expect(response).not.toHaveProperty('deletedAt');
      expect(response).toMatchObject({
        id: item.id,
        title: item.title,
        key: item.key,
        level: item.level,
      });
      await expect(controller.findOne({ user: user }, 0)).rejects.toThrow(
        HttpException,
      );
    });

    it('should create a role from create function', async () => {
      const item = makeRole({ deletedAt: null });
      const response = await controller.create({ user: user }, item);

      expect(response).toBeInstanceOf(RoleResponse);
      expect(response).not.toHaveProperty('updatedAt');
      expect(response).not.toHaveProperty('deletedAt');
      expect(response).toMatchObject({
        id: item.id,
        title: item.title,
        key: item.key,
        level: item.level,
      });
    });

    it('should update a role from update function', async () => {
      const item = makeRole({ deletedAt: null });
      await controller.create({ user: user }, item);
      const response = await controller.update({ user: user }, item.id, item);

      expect(response).toBeInstanceOf(RoleResponse);
      expect(response).not.toHaveProperty('updatedAt');
      expect(response).not.toHaveProperty('deletedAt');
      expect(response).toMatchObject({
        id: item.id,
        title: item.title,
        key: item.key,
        level: item.level,
      });
    });

    it('should delete a role from delete function', async () => {
      const item = makeRole({ deletedAt: null });
      await controller.create({ user: user }, item);

      expect(await controller.delete({ user: user }, item.id)).toBeNull();
      await expect(controller.delete({ user: user }, 0)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
