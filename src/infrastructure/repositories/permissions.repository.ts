import { Injectable } from '@nestjs/common';
import { Permission } from 'src/domain/models/permission';
import { PermissionsRepositoryInterface } from 'src/domain/repositories/permissions.interface';
import { GenericMapper } from 'src/presentation/mappers/generic.mapper';
import { GenericRepository } from './generic.repository';

@Injectable()
export class PermissionsRepository
  extends GenericRepository<Permission>
  implements PermissionsRepositoryInterface
{
  protected table: string = 'permissions';
  protected searchFields: string[] = ['title'];

  async findOneByKey(key: string): Promise<Permission> {
    const itemFromDatabase = await this.prisma[this.table].findUnique({
      where: { key, deletedAt: null },
    });

    return itemFromDatabase
      ? GenericMapper.getInstance(Permission).toModel(itemFromDatabase)
      : null;
  }

  async findManyByIds(ids: number[]): Promise<Permission[]> {
    const itemFromDatabase = await this.prisma[this.table].findMany({
      where: { id: { in: ids }, deletedAt: null },
    });

    return itemFromDatabase.map(GenericMapper.getInstance(Permission).toModel);
  }
}
