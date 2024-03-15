import { Role } from 'src/domain/models/role';
import { RolesRepositoryInterface } from 'src/domain/repositories/roles.interface';
import { GenericInMemoryRepository } from './generic.database';
import { RolePermission } from 'src/domain/models/rolePermission';
import { Paginated } from 'src/domain/models/commons/paginated';
import { PaginatedQuery } from 'src/domain/models/commons/paginatedQuery';

export class RolesInMemoryRepository
  extends GenericInMemoryRepository<Role>
  implements RolesRepositoryInterface
{
  async create(data: Role): Promise<Role> {
    const newItem = new Role({
      ...data,
      id: data.id ?? this.list.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: data.permissions ?? [],
    });
    this.list.push(newItem);
    return newItem;
  }

  async findOneByKey(key: string): Promise<Role> {
    const item = this.list.find((item) => item.key === key);
    return item ? new Role(item) : null;
  }

  async findManyByIds(ids: number[]): Promise<Role[]> {
    return this.list
      .filter((item) => ids.includes(item.id))
      .map((item) => new Role(item));
  }

  async findAll(params?: PaginatedQuery): Promise<Paginated<Role>> {
    return new Paginated<Role>({
      data: this.list
        .filter((item) => !item.deletedAt)
        .map((item) => new Role(item)),
      total: this.list.length,
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
    });
  }

  async findOne(id: number): Promise<Role | null> {
    const item = await super.findOne(id);
    return item ? new Role(item) : null;
  }

  async addPermission(rolePermission: RolePermission): Promise<Role> {
    const index = this.list
      .filter((item) => !item.deletedAt)
      .findIndex((item) => item.id === rolePermission.roleId);
    if (index === -1) return null;
    this.list[index].permissions.push(rolePermission);
    return this.list[index];
  }

  async removePermission(rolePermission: RolePermission): Promise<Role> {
    const index = this.list
      .filter((item) => !item.deletedAt)
      .findIndex((item) => item.id === rolePermission.roleId);
    if (index === -1) return null;
    this.list[index].permissions = this.list[index].permissions.filter(
      (item) => item.id !== rolePermission.permissionId,
    );
    return this.list[index];
  }
}
