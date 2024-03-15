import { Permission } from 'src/domain/models/permission';
import { GenericRepositoryInterface } from './generic.interface';

export abstract class PermissionsRepositoryInterface extends GenericRepositoryInterface<Permission> {
  abstract findOneByKey(key: string): Promise<Permission | null>;
  abstract findManyByIds(ids: number[]): Promise<Permission[]>;
}
