import { Role } from 'src/domain/models/role';
import { faker } from '@faker-js/faker';
import { Paginated } from 'src/domain/models/commons/paginated';

export const makeRole = (override: Partial<Role> = {}): Role => {
  return new Role({
    id: faker.number.int({ min: 1, max: 999999 }),
    title: faker.lorem.sentence(3),
    key: faker.string.alpha({ length: 10 }).toUpperCase(),
    level: faker.number.int({ min: 0, max: 10 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: faker.helpers.arrayElement([faker.date.recent(), null]),
    ...override,
  });
};

export const makeRoleList = (
  length: number = 5,
  override: Partial<Role> = {},
): Role[] => {
  return Array.from({ length }, () => makeRole(override));
};

export const makePaginatedRole = (
  length: number = 5,
  override: Partial<Paginated<Role>> = {},
): Paginated<Role> => {
  return new Paginated<Role>({
    data: Array.from({ length }, () => makeRole()),
    total: length,
    page: 1,
    limit: 10,
    ...override,
  });
};
