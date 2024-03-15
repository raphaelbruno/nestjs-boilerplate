import { Role } from './role';
import { User } from './user';

export class UserRole {
  constructor(data?: Partial<UserRole>) {
    Object.assign(this, data);
  }

  userId: number;
  roleId: number;
  assignedBy: number;
  assignedAt?: Date;

  users?: User[];
  roles?: Role[];
}
