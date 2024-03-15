import { Injectable } from '@nestjs/common';
import { NotFoundException } from 'src/application/exceptions/notFound.exception';
import { PermissionsRepositoryInterface } from 'src/domain/repositories/permissions.interface';

@Injectable()
export class DeletePermissionUseCase {
  constructor(
    private readonly permissionsRepository: PermissionsRepositoryInterface,
  ) {}

  async execute(id: number): Promise<boolean> {
    if (!(await this.permissionsRepository.findOne(id)))
      throw new NotFoundException();

    return await this.permissionsRepository.delete(id);
  }
}
