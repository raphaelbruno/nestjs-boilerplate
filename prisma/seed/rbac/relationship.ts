import { PermissionKey } from '../../../src/domain/models/enums/permission.enum';
import { RoleKey } from '../../../src/domain/models/enums/role.enum';

export const relationship = {
  roleUser: [
    {
      email: 'admin@localhost.net',
      password: 'Pass@123',
      roles: [RoleKey.Admin],
    },
    {
      email: 'manager@localhost.net',
      password: 'Pass@123',
      roles: [RoleKey.Manager],
    },
    {
      email: 'reader@localhost.net',
      password: 'Pass@123',
      roles: [RoleKey.Reader],
    },
  ],
  rolePermission: [
    {
      key: RoleKey.Admin,
      level: 0,
      permissions: [],
    },
    {
      key: RoleKey.Manager,
      level: 1,
      permissions: [
        PermissionKey.UserRead,
        PermissionKey.UserCreate,
        PermissionKey.UserUpdate,
        PermissionKey.UserDelete,

        PermissionKey.RoleRead,
        PermissionKey.RoleCreate,
        PermissionKey.RoleUpdate,
        PermissionKey.RoleDelete,

        PermissionKey.PermissionRead,
        PermissionKey.PermissionCreate,
        PermissionKey.PermissionUpdate,
        PermissionKey.PermissionDelete,
      ],
    },
    {
      key: RoleKey.Reader,
      level: 2,
      permissions: [
        PermissionKey.UserRead,
        PermissionKey.RoleRead,
        PermissionKey.PermissionRead,
      ],
    },
  ],
};
