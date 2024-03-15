import { Role } from 'src/domain/models/role';
import { GenericRepositoryInterface } from './generic.interface';
import { RolePermission } from '../models/rolePermission';

export abstract class RolesRepositoryInterface extends GenericRepositoryInterface<Role> {
  abstract findOneByKey(key: string): Promise<Role | null>;
  abstract findManyByIds(ids: number[]): Promise<Role[]>;
  abstract addPermission(rolePermission: RolePermission): Promise<Role | null>;
  abstract removePermission(
    rolePermission: RolePermission,
  ): Promise<Role | null>;
}
