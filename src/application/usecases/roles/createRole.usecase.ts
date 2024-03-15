import { Injectable } from '@nestjs/common';
import { ConflictException } from 'src/application/exceptions/conflict.exception';
import { ForbiddenException } from 'src/application/exceptions/forbidden.exception';
import { Role } from 'src/domain/models/role';
import { User } from 'src/domain/models/user';
import { RolesRepositoryInterface } from 'src/domain/repositories/roles.interface';

@Injectable()
export class CreateRoleUseCase {
  constructor(private readonly rolesRepository: RolesRepositoryInterface) {}

  async execute(user: User, data: Role): Promise<Role> {
    const role = new Role(data);
    role.fillCanManageField(user);

    if (!role.canManage) throw new ForbiddenException();

    if (await this.rolesRepository.findOneByKey(data.key))
      throw new ConflictException();

    return await this.rolesRepository.create(data);
  }
}
