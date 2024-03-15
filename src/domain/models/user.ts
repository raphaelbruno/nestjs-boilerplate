import { GenericMapper } from 'src/presentation/mappers/generic.mapper';
import { Role } from './role';
import { Token } from './token';
import { Permission } from './permission';

export class User {
  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }

  id?: number;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  canManage?: boolean;

  tokens?: Token[];
  roles?: Role[];

  getGreaterRole(): Role {
    if (!this.roles) return null;

    return this.roles.reduce(
      (greaterRole, role) =>
        !greaterRole || role.level < greaterRole.level ? role : greaterRole,
      null,
    );
  }

  isSuperUser(): boolean {
    return this.roles && this.roles.some((role) => role.level === 0);
  }

  fillCanManageField(user: User): boolean {
    this.canManage =
      user.isSuperUser() ||
      this.id == user.id ||
      !this.getGreaterRole() ||
      (user.getGreaterRole() &&
        user.getGreaterRole().level < this.getGreaterRole().level);

    return this.canManage;
  }

  static withRolesPermissions(item: {
    roles: [{ role: { permissions: [{ permission: any }] } }];
  }): User {
    return GenericMapper.getInstance(User).toModel({
      ...item,
      roles: item.roles.map((role) =>
        GenericMapper.getInstance(Role).toModel({
          ...role.role,
          permissions: role.role.permissions.map((permission) =>
            GenericMapper.getInstance(Permission).toModel(
              permission.permission,
            ),
          ),
        }),
      ),
    });
  }
}
