import { Role } from './role';
import { User } from './user';

export class Permission {
  constructor(data?: Partial<Permission>) {
    Object.assign(this, data);
  }

  id?: number;
  title: string;
  key: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  permissions?: Role[];
  users?: User[];
}
