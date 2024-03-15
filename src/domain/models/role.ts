import { GenericMapper } from 'src/presentation/mappers/generic.mapper';
import { Permission } from './permission';
import { User } from './user';

export class Role {
  constructor(data?: Partial<Role>) {
    Object.assign(this, data);
  }

  id?: number;
  title: string;
  key: string;
  level: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  canManage?: boolean;

  permissions?: Permission[];
  users?: User[];

  fillCanManageField(user: User): boolean {
    this.canManage =
      user.isSuperUser() ||
      (user.getGreaterRole() && user.getGreaterRole().level < this.level);

    return this.canManage;
  }

  static withPermissions(item: { permissions: [{ permission: any }] }): Role {
    return GenericMapper.getInstance(Role).toModel({
      ...item,
      permissions: item.permissions.map((permission) =>
        GenericMapper.getInstance(Permission).toModel(permission.permission),
      ),
    });
  }
}
