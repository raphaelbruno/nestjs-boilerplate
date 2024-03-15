import { PrismaClient } from '@prisma/client';
import { generatePasswordHash } from '../src/application/helpers/security.helper';
import { PermissionKey } from '../src/domain/models/enums/permission.enum';
import { RoleKey } from '../src/domain/models/enums/role.enum';
import { relationship } from './seed/rbac';

const prisma = new PrismaClient();

async function main() {
  // Users
  const admin = await prisma.users.create({
    data: {
      email: 'admin@localhost.net',
      password: await generatePasswordHash('Pass@123'),
    },
  });

  const permissions = await seedPermissions();
  const roles = await seedRoles();
  await seedRolePermission(permissions, roles, admin.id);
  await seedUserRole(roles, admin.id);
}

async function seedRoles(): Promise<object> {
  const objects = {};

  for (const key of Object.values(RoleKey)) {
    const title = key
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
    objects[key] = await prisma.roles.create({
      data: { title, key, level: 0 },
    });
  }

  return objects;
}

async function seedPermissions(): Promise<object> {
  const objects = {};

  for (const key of Object.values(PermissionKey)) {
    const title = key
      .split(':')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
    objects[key] = await prisma.permissions.create({
      data: { title, key },
    });
  }

  return objects;
}

async function seedRolePermission(
  permissions: object,
  roles: object,
  assignedBy: number,
): Promise<void> {
  for (const roleKey of Object.keys(relationship)) {
    const role = relationship[roleKey];
    await prisma.roles.update({
      where: { id: roles[roleKey].id },
      data: {
        level: role.level,
        permissions: {
          create: role.permissions
            ? role.permissions.map((permissionKey) => ({
                permissionId: permissions[permissionKey].id,
                assignedBy: assignedBy,
              }))
            : [],
        },
      },
    });
  }
}

async function seedUserRole(roles: object, assignedBy: number): Promise<void> {
  await prisma.userRole.create({
    data: {
      userId: assignedBy,
      roleId: roles[RoleKey.Admin].id,
      assignedBy: assignedBy,
    },
  });

  await prisma.users.create({
    data: {
      email: 'manager@localhost.net',
      password: await generatePasswordHash('Pass@123'),
      roles: {
        create: [{ roleId: roles[RoleKey.Manager].id, assignedBy: assignedBy }],
      },
    },
  });

  await prisma.users.create({
    data: {
      email: 'reader@localhost.net',
      password: await generatePasswordHash('Pass@123'),
      roles: {
        create: [{ roleId: roles[RoleKey.Reader].id, assignedBy: assignedBy }],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
