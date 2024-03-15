import { Permission } from './permission';
import { Role } from './role';

export class RolePermission {
  constructor(data?: Partial<RolePermission>) {
    Object.assign(this, data);
  }

  roleId: number;
  permissionId: number;
  assignedBy: number;
  assignedAt?: Date;

  roles?: Role[];
  permissions?: Permission[];
}
