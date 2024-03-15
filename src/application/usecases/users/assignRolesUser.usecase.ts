import { Injectable } from '@nestjs/common';
import { ForbiddenException } from 'src/application/exceptions/forbidden.exception';
import { NotFoundException } from 'src/application/exceptions/notFound.exception';
import { User } from 'src/domain/models/user';
import { RolesRepositoryInterface } from 'src/domain/repositories/roles.interface';
import { UsersRepositoryInterface } from 'src/domain/repositories/users.interface';

@Injectable()
export class AssignRolesUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly rolesRepository: RolesRepositoryInterface,
  ) {}

  async execute(
    user: User,
    id: number,
    rolesId: number[],
  ): Promise<User | null> {
    const item: User = await this.usersRepository.findOne(id);

    if (!item) throw new NotFoundException();

    item.fillCanManageField(user);

    if (!item.canManage) throw new ForbiddenException();

    const roles = await this.rolesRepository.findManyByIds(rolesId);
    roles.forEach((item) => item.fillCanManageField(user));

    if (roles.some((item) => !item.canManage)) throw new ForbiddenException();

    const currentRoles = item.roles.map((item) => item.id);
    const desiredRoles = roles.map((item) => item.id);
    const rolesToAdd = desiredRoles.filter(
      (item) => !currentRoles.includes(item),
    );
    const rolesToRemove = currentRoles.filter(
      (item) => !desiredRoles.includes(item),
    );

    for (const roleId of rolesToAdd)
      await this.usersRepository.addRole({
        userId: id,
        roleId,
        assignedBy: user.id,
      });

    for (const roleId of rolesToRemove)
      await this.usersRepository.removeRole({
        userId: id,
        roleId,
        assignedBy: null,
      });

    return await this.usersRepository.findOne(id);
  }
}
