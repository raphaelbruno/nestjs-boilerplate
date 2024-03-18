import { PrismaClient } from '@prisma/client';
import { generatePasswordHash } from '../../../src/application/helpers/security.helper';
import { PermissionKey } from '../../../src/domain/models/enums/permission.enum';
import { RoleKey } from '../../../src/domain/models/enums/role.enum';
import { relationship } from './relationship';

let database: PrismaClient;

export default async function seeder(prisma: PrismaClient): Promise<boolean> {
  database = prisma;
  const amountUsers = await database.users.count();
  const amountRoles = await database.roles.count();
  const amountPermissions = await database.permissions.count();

  if (amountUsers > 0 || amountRoles > 0 || amountPermissions > 0) return false;

  await seedUsers();

  await seedRoles();
  await seedPermissions();

  await seedUserRole();
  await seedRolePermission();

  return true;
}

async function seedRoles(): Promise<any[]> {
  const data = relationship.rolePermission.map(({ key, level }) => {
    return { title: getTitleFromKey(key), key, level };
  });
  return await database.$transaction(
    data.map((item) => database.roles.create({ data: item })),
  );
}

async function seedPermissions(): Promise<any[]> {
  const data = Object.values(PermissionKey).map((key) => ({
    title: getTitleFromKey(key),
    key,
  }));
  return await database.$transaction(
    data.map((item) => database.permissions.create({ data: item })),
  );
}

async function seedUsers(): Promise<void> {
  await database.users.createMany({
    data: await Promise.all(
      relationship.roleUser.map(async (user) => ({
        email: user.email,
        password: await generatePasswordHash(user.password),
      })),
    ),
  });
}

async function seedUserRole(): Promise<void> {
  const admin = await getAdmin();
  const roles = await database.roles.findMany();
  const users = await database.users.findMany();

  for (const item of relationship.roleUser) {
    const user = users.find((user) => user.email === item.email);
    await database.users.update({
      where: { id: user.id },
      data: {
        roles: {
          create: item.roles.map((role) => ({
            roleId: roles.find((r) => r.key === role).id,
            assignedBy: admin.id,
          })),
        },
      },
    });
  }
}

async function seedRolePermission(): Promise<void> {
  const admin = await getAdmin();
  const roles = await database.roles.findMany();
  const permissions = await database.permissions.findMany();

  for (const item of relationship.rolePermission) {
    const role = roles.find((role) => role.key === item.key);
    await database.roles.update({
      where: { id: role.id },
      data: {
        permissions: {
          create: item.permissions.map((permission) => ({
            permissionId: permissions.find((p) => p.key === permission).id,
            assignedBy: admin.id,
          })),
        },
      },
    });
  }
}

async function getAdmin(): Promise<any> {
  return await database.users.findFirst({
    where: {
      email: relationship.roleUser.find((user) =>
        user.roles.includes(RoleKey.Admin),
      ).email,
    },
  });
}

function getTitleFromKey(key) {
  return key
    .toLowerCase()
    .replace(/[_:]/g, ' ')
    .replace(/(?:^|\s)\S/g, (firstLetter: string) => firstLetter.toUpperCase());
}
