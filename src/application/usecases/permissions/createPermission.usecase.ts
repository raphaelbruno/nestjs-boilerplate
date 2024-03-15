import { Injectable } from '@nestjs/common';
import { ConflictException } from 'src/application/exceptions/conflict.exception';
import { Permission } from 'src/domain/models/permission';
import { PermissionsRepositoryInterface } from 'src/domain/repositories/permissions.interface';

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    private readonly permissionsRepository: PermissionsRepositoryInterface,
  ) {}

  async execute(data: Permission): Promise<Permission> {
    if (await this.permissionsRepository.findOneByKey(data.key))
      throw new ConflictException();

    return await this.permissionsRepository.create(data);
  }
}
