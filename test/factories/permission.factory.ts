import { Permission } from 'src/domain/models/permission';
import { faker } from '@faker-js/faker';
import { Paginated } from 'src/domain/models/commons/paginated';

export const makePermission = (
  override: Partial<Permission> = {},
): Permission => {
  return new Permission({
    id: faker.number.int({ min: 1, max: 999999 }),
    title: faker.lorem.sentence(3),
    key: faker.string.alpha({ length: 10 }).toUpperCase(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: faker.helpers.arrayElement([faker.date.recent(), null]),
    ...override,
  });
};

export const makePermissionList = (
  length: number = 5,
  override: Partial<Permission> = {},
): Permission[] => {
  return Array.from({ length }, () => makePermission(override));
};

export const makePaginatedPermission = (
  length: number = 5,
  override: Partial<Paginated<Permission>> = {},
): Paginated<Permission> => {
  return new Paginated<Permission>({
    data: Array.from({ length }, () => makePermission()),
    total: length,
    page: 1,
    limit: 10,
    ...override,
  });
};
