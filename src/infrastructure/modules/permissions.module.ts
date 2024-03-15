import { Module } from '@nestjs/common';
import { CreatePermissionUseCase } from 'src/application/usecases/permissions/createPermission.usecase';
import { DeletePermissionUseCase } from 'src/application/usecases/permissions/deletePermission.usecase';
import { FindAllPermissionsUseCase } from 'src/application/usecases/permissions/findAllPermissions.usecase';
import { FindOnePermissionUseCase } from 'src/application/usecases/permissions/findOnePermission.usecase';
import { UpdatePermissionUseCase } from 'src/application/usecases/permissions/updatePermission.usecase';
import { PermissionsRepositoryInterface } from 'src/domain/repositories/permissions.interface';
import { PermissionsController } from 'src/presentation/controllers/permissions.controller';
import { PermissionsRepository } from '../repositories/permissions.repository';

@Module({
  controllers: [PermissionsController],
  providers: [
    FindAllPermissionsUseCase,
    FindOnePermissionUseCase,
    CreatePermissionUseCase,
    UpdatePermissionUseCase,
    DeletePermissionUseCase,
    {
      provide: PermissionsRepositoryInterface,
      useClass: PermissionsRepository,
    },
  ],
})
export class PermissionsModule {}
