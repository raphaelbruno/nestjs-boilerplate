import { Injectable } from '@nestjs/common';
import { ForbiddenException } from 'src/application/exceptions/forbidden.exception';
import { NotFoundException } from 'src/application/exceptions/notFound.exception';
import { Role } from 'src/domain/models/role';
import { User } from 'src/domain/models/user';
import { RolesRepositoryInterface } from 'src/domain/repositories/roles.interface';

@Injectable()
export class DeleteRoleUseCase {
  constructor(private readonly rolesRepository: RolesRepositoryInterface) {}

  async execute(user: User, id: number): Promise<boolean> {
    const item: Role = await this.rolesRepository.findOne(id);

    if (!item) throw new NotFoundException();

    item.fillCanManageField(user);

    if (!item.canManage) throw new ForbiddenException();

    return await this.rolesRepository.delete(item.id);
  }
}
