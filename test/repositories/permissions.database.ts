import { Permission } from 'src/domain/models/permission';
import { PermissionsRepositoryInterface } from 'src/domain/repositories/permissions.interface';
import { GenericInMemoryRepository } from './generic.database';

export class PermissionsInMemoryRepository
  extends GenericInMemoryRepository<Permission>
  implements PermissionsRepositoryInterface
{
  async findOneByKey(key: string): Promise<Permission> {
    return this.list.find((item) => item.key === key);
  }

  async findManyByIds(ids: number[]): Promise<Permission[]> {
    return this.list.filter((item) => ids.includes(item.id));
  }
}
