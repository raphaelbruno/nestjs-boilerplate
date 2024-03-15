import { Injectable } from '@nestjs/common';
import { Paginated } from 'src/domain/models/commons/paginated';
import { PaginatedQuery } from 'src/domain/models/commons/paginatedQuery';
import { Role } from 'src/domain/models/role';
import { RolePermission } from 'src/domain/models/rolePermission';
import { RolesRepositoryInterface } from 'src/domain/repositories/roles.interface';
import { GenericMapper } from 'src/presentation/mappers/generic.mapper';
import { GenericRepository } from './generic.repository';

@Injectable()
export class RolesRepository
  extends GenericRepository<Role>
  implements RolesRepositoryInterface
{
  protected table: string = 'roles';
  protected searchFields: string[] = ['title'];
  protected relationship: object = {
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  };

  async findAll(params?: PaginatedQuery): Promise<Paginated<Role>> {
    const paginated: any = await super.findAll(params);

    return new Paginated<Role>({
      ...paginated,
      data: paginated.data.map(Role.withPermissions),
    });
  }

  async findOne(id: number): Promise<Role> {
    const itemFromDatabase: any = await super.findOne(id);
    if (!itemFromDatabase) return null;

    return Role.withPermissions(itemFromDatabase);
  }

  async findOneByKey(key: string): Promise<Role> {
    const itemFromDatabase = await this.prisma[this.table].findUnique({
      where: { key, deletedAt: null },
      ...this.relationship,
    });

    if (!itemFromDatabase) return null;

    return Role.withPermissions(itemFromDatabase);
  }

  async findManyByIds(ids: number[]): Promise<Role[]> {
    const itemFromDatabase = await this.prisma.roles.findMany({
      where: { id: { in: ids }, deletedAt: null },
    });

    return itemFromDatabase.map(GenericMapper.getInstance(Role).toModel);
  }

  async addPermission(rolePermission: RolePermission): Promise<Role | null> {
    const itemFromDatabase = await this.prisma.roles.update({
      where: { id: rolePermission.roleId, deletedAt: null },
      data: {
        permissions: {
          create: {
            permissionId: rolePermission.permissionId,
            assignedBy: rolePermission.assignedBy,
          },
        },
      },
    });

    if (!itemFromDatabase) return null;

    return GenericMapper.getInstance(Role).toModel(itemFromDatabase);
  }

  async removePermission(rolePermission: RolePermission): Promise<Role | null> {
    const itemFromDatabase = await this.prisma.roles.update({
      where: { id: rolePermission.roleId, deletedAt: null },
      data: {
        permissions: {
          deleteMany: { permissionId: rolePermission.permissionId },
        },
      },
    });

    if (!itemFromDatabase) return null;

    return GenericMapper.getInstance(Role).toModel(itemFromDatabase);
  }
}
