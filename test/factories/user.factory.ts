import { User } from 'src/domain/models/user';
import { faker } from '@faker-js/faker';
import { Paginated } from 'src/domain/models/commons/paginated';

export const makeUser = (override: Partial<User> = {}): User => {
  return new User({
    id: faker.number.int({ min: 1, max: 999999 }),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: faker.helpers.arrayElement([faker.date.recent(), null]),
    ...override,
  });
};

export const makeUserList = (
  length: number = 5,
  override: Partial<User> = {},
): User[] => {
  return Array.from({ length }, () => makeUser(override));
};

export const makePaginatedUser = (
  length: number = 5,
  override: Partial<Paginated<User>> = {},
): Paginated<User> => {
  return new Paginated<User>({
    data: Array.from({ length }, () => makeUser()),
    total: length,
    page: 1,
    limit: 10,
    ...override,
  });
};
