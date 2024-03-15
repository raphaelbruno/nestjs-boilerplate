import { Injectable } from '@nestjs/common';
import { NotFoundException } from 'src/application/exceptions/notFound.exception';
import { Permission } from 'src/domain/models/permission';
import { PermissionsRepositoryInterface } from 'src/domain/repositories/permissions.interface';

@Injectable()
export class FindOnePermissionUseCase {
  constructor(
    private readonly permissionsRepository: PermissionsRepositoryInterface,
  ) {}

  async execute(id: number): Promise<Permission | null> {
    const item = await this.permissionsRepository.findOne(id);

    if (!item) throw new NotFoundException();

    return item;
  }
}
