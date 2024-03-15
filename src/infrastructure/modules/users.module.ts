import { Module } from '@nestjs/common';
import { AssignRolesUserUseCase } from 'src/application/usecases/users/assignRolesUser.usecase';
import { ChangePasswordUserUseCase } from 'src/application/usecases/users/changePasswordUser.usecase';
import { CreateUserUseCase } from 'src/application/usecases/users/createUser.usecase';
import { DeleteUserUseCase } from 'src/application/usecases/users/deleteUser.usecase';
import { FindAllUsersUseCase } from 'src/application/usecases/users/findAllUsers.usecase';
import { FindOneUserUseCase } from 'src/application/usecases/users/findOneUser.usecase';
import { UpdateUserUseCase } from 'src/application/usecases/users/updateUser.usecase';
import { RolesRepositoryInterface } from 'src/domain/repositories/roles.interface';
import { UsersRepositoryInterface } from 'src/domain/repositories/users.interface';
import { UsersController } from 'src/presentation/controllers/users.controller';
import { RolesRepository } from '../repositories/roles.repository';
import { UsersRepository } from '../repositories/users.repository';

@Module({
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
      useClass: UsersRepository,
    },
    {
      provide: RolesRepositoryInterface,
      useClass: RolesRepository,
    },
  ],
})
export class UsersModule {}
