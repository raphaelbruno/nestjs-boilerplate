import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordUserUseCase } from 'src/application/usecases/users/changePasswordUser.usecase';
import { CreateUserUseCase } from 'src/application/usecases/users/createUser.usecase';
import { DeleteUserUseCase } from 'src/application/usecases/users/deleteUser.usecase';
import { FindAllUsersUseCase } from 'src/application/usecases/users/findAllUsers.usecase';
import { FindOneUserUseCase } from 'src/application/usecases/users/findOneUser.usecase';
import { UpdateUserUseCase } from 'src/application/usecases/users/updateUser.usecase';
import { User } from 'src/domain/models/user';
import { UsersRepositoryInterface } from 'src/domain/repositories/users.interface';
import { makeUser } from 'test/factories/user.factory';
import { UsersInMemoryRepository } from 'test/repositories/users.database';
import { PaginatedResponse } from '../schemas/paginated.schema';
import { UserResponse } from '../schemas/user.schema';
import { UsersController } from './users.controller';
import { AssignRolesUserUseCase } from 'src/application/usecases/users/assignRolesUser.usecase';
import { RolesRepositoryInterface } from 'src/domain/repositories/roles.interface';
import { RolesInMemoryRepository } from 'test/repositories/roles.database';

describe('UsersController', () => {
  let controller: UsersController;
  let user: User;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        FindAllUsersUseCase,
        FindOneUserUseCase,
        CreateUserUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        ChangePasswordUserUseCase,
        AssignRolesUserUseCase,
        {
          provide: UsersRepositoryInterface,
          useClass: UsersInMemoryRepository,
        },
        {
          provide: RolesRepositoryInterface,
          useClass: RolesInMemoryRepository,
        },
      ],
    }).compile();

    controller = app.get<UsersController>(UsersController);
    user = makeUser({ deletedAt: null });
  });

  describe('root', () => {
    it('should return paginated users from findAll function', async () => {
      const listAll = await controller.findAll({ user });
      expect(listAll).toBeInstanceOf(PaginatedResponse<UserResponse>);
    });

    it('should return a user from findOne function', async () => {
      const item = makeUser({ deletedAt: null });
      await controller.create(item);
      const response = await controller.findOne({ user }, item.id);

      expect(response).toBeInstanceOf(UserResponse);
      expect(response).not.toHaveProperty('updatedAt');
      expect(response).not.toHaveProperty('deletedAt');
      expect(response).toMatchObject({
        id: item.id,
        email: item.email,
      });
      await expect(controller.findOne({ user }, 0)).rejects.toThrow(
        HttpException,
      );
    });

    it('should create a user from create function', async () => {
      const item = makeUser({ deletedAt: null });
      const response = await controller.create(item);

      expect(response).toBeInstanceOf(UserResponse);
      expect(response).not.toHaveProperty('updatedAt');
      expect(response).not.toHaveProperty('deletedAt');
      expect(response).toMatchObject({
        id: item.id,
        email: item.email,
      });
    });

    it('should update a user from update function', async () => {
      const item = makeUser({ deletedAt: null });
      await controller.create(item);
      const response = await controller.update({ user }, item.id, item);

      expect(response).toBeInstanceOf(UserResponse);
      expect(response).not.toHaveProperty('updatedAt');
      expect(response).not.toHaveProperty('deletedAt');
      expect(response).toMatchObject({
        id: item.id,
        email: item.email,
      });
    });

    it('should delete a user from delete function', async () => {
      const item = makeUser({ deletedAt: null });
      await controller.create(item);

      expect(await controller.delete({ user }, item.id)).toBeNull();
      await expect(controller.delete({ user }, 0)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
