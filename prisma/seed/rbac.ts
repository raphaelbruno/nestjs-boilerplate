import { PermissionKey } from '../../src/domain/models/enums/permission.enum';
import { RoleKey } from '../../src/domain/models/enums/role.enum';

export const relationship = {
  [RoleKey.Admin]: {
    level: 0,
    permissions: [],
  },
  [RoleKey.Manager]: {
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
  [RoleKey.Reader]: {
    level: 2,
    permissions: [
      PermissionKey.UserRead,
      PermissionKey.RoleRead,
      PermissionKey.PermissionRead,
    ],
  },
};
