import { faker } from '@faker-js/faker';
import { Paginated } from 'src/domain/models/commons/paginated';
import { Sample } from 'src/domain/models/sample';

export const makeSample = (override: Partial<Sample> = {}): Sample => {
  return new Sample({
    id: faker.number.int({ min: 1, max: 999999 }),
    title: faker.lorem.sentence(3),
    userId: faker.number.int({ min: 1, max: 999999 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: faker.helpers.arrayElement([faker.date.recent(), null]),
    ...override,
  });
};

export const makeSampleList = (
  length: number = 5,
  override: Partial<Sample> = {},
): Sample[] => {
  return Array.from({ length }, () => makeSample(override));
};

export const makePaginatedSample = (
  length: number = 5,
  override: Partial<Paginated<Sample>> = {},
): Paginated<Sample> => {
  return new Paginated<Sample>({
    data: Array.from({ length }, () => makeSample()),
    total: length,
    page: 1,
    limit: 10,
    ...override,
  });
};
