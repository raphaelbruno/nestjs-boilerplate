import { Injectable } from '@nestjs/common';
import { ForbiddenException } from 'src/application/exceptions/forbidden.exception';
import { NotFoundException } from 'src/application/exceptions/notFound.exception';
import { Role } from 'src/domain/models/role';
import { User } from 'src/domain/models/user';
import { PermissionsRepositoryInterface } from 'src/domain/repositories/permissions.interface';
import { RolesRepositoryInterface } from 'src/domain/repositories/roles.interface';

@Injectable()
export class AssignPermissionsRoleUseCase {
  constructor(
    private readonly rolesRepository: RolesRepositoryInterface,
    private readonly permissionsRepository: PermissionsRepositoryInterface,
  ) {}

  async execute(
    user: User,
    id: number,
    permissionsId: number[],
  ): Promise<Role | null> {
    const item = await this.rolesRepository.findOne(id);

    if (!item) throw new NotFoundException();

    item.fillCanManageField(user);

    if (!item.canManage) throw new ForbiddenException();

    const permissions =
      await this.permissionsRepository.findManyByIds(permissionsId);

    const currentPermissions = item.permissions.map((item) => item.id);
    const desiredPermissions = permissions.map((item) => item.id);
    const permissionsToAdd = desiredPermissions.filter(
      (item) => !currentPermissions.includes(item),
    );
    const permissionsToRemove = currentPermissions.filter(
      (item) => !desiredPermissions.includes(item),
    );

    for (const permissionId of permissionsToAdd)
      await this.rolesRepository.addPermission({
        roleId: id,
        permissionId,
        assignedBy: user.id,
      });

    for (const permissionId of permissionsToRemove)
      await this.rolesRepository.removePermission({
        roleId: id,
        permissionId,
        assignedBy: null,
      });

    return await this.rolesRepository.findOne(id);
  }
}
