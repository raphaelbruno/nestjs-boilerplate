import { Paginated } from '../models/commons/paginated';
import { PaginatedQuery } from '../models/commons/paginatedQuery';

export abstract class GenericRepositoryInterface<T> {
  abstract findAll(params?: PaginatedQuery): Promise<Paginated<T>>;
  abstract findOne(id: number): Promise<T | null>;
  abstract create(item: T): Promise<T>;
  abstract update(item: T): Promise<T | null>;
  abstract delete(id: number): Promise<boolean>;
}
