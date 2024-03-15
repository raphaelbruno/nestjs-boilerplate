import { SetMetadata } from '@nestjs/common';
import { PermissionKey } from 'src/domain/models/enums/permission.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: PermissionKey[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
