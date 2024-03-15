import { Injectable } from '@nestjs/common';
import { NotFoundException } from 'src/application/exceptions/notFound.exception';
import { Permission } from 'src/domain/models/permission';
import { PermissionsRepositoryInterface } from 'src/domain/repositories/permissions.interface';

@Injectable()
export class UpdatePermissionUseCase {
  constructor(
    private readonly permissionsRepository: PermissionsRepositoryInterface,
  ) {}

  async execute(data: Permission): Promise<Permission | null> {
    if (!(await this.permissionsRepository.findOne(data.id)))
      throw new NotFoundException();

    const updated = await this.permissionsRepository.update(data);
    if (!updated) return null;

    return updated;
  }
}
