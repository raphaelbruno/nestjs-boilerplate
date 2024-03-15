import { Module } from '@nestjs/common';
import { CreateRoleUseCase } from 'src/application/usecases/roles/createRole.usecase';
import { DeleteRoleUseCase } from 'src/application/usecases/roles/deleteRole.usecase';
import { FindAllRolesUseCase } from 'src/application/usecases/roles/findAllRoles.usecase';
import { FindOneRoleUseCase } from 'src/application/usecases/roles/findOneRole.usecase';
import { UpdateRoleUseCase } from 'src/application/usecases/roles/updateRole.usecase';
import { RolesRepositoryInterface } from 'src/domain/repositories/roles.interface';
import { RolesController } from 'src/presentation/controllers/roles.controller';
import { RolesRepository } from '../repositories/roles.repository';
import { AssignPermissionsRoleUseCase } from 'src/application/usecases/roles/assignPermissionsUser.usecase';
import { PermissionsRepositoryInterface } from 'src/domain/repositories/permissions.interface';
import { PermissionsRepository } from '../repositories/permissions.repository';

@Module({
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
      useClass: RolesRepository,
    },
    {
      provide: PermissionsRepositoryInterface,
      useClass: PermissionsRepository,
    },
  ],
})
export class RolesModule {}
