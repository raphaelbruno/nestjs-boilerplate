import { Paginated } from 'src/domain/models/commons/paginated';
import { PaginatedQuery } from 'src/domain/models/commons/paginatedQuery';
import { GenericRepositoryInterface } from 'src/domain/repositories/generic.interface';

export class GenericInMemoryRepository<T>
  implements GenericRepositoryInterface<T>
{
  protected list: any[] = [];

  async create(data: T | any): Promise<T> {
    const newItem = {
      ...data,
      id: data.id ?? this.list.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T;
    this.list.push(newItem);
    return newItem;
  }

  async findAll(params?: PaginatedQuery): Promise<Paginated<T>> {
    return new Paginated<T>({
      data: this.list.filter((item) => !item.deletedAt),
      total: this.list.length,
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
    });
  }

  async findOne(id: number): Promise<T | null> {
    return this.list
      .filter((item) => !item.deletedAt)
      .filter((s) => s.id === id)[0];
  }

  async update(data: T | any): Promise<T | null> {
    const index = this.list
      .filter((item) => !item.deletedAt)
      .findIndex((item) => item.id === data.id);
    if (index === -1) return null;

    this.list[index] = { ...this.list[index], ...data } as T;

    return this.list[index];
  }

  async delete(id: number): Promise<boolean> {
    const index = this.list
      .filter((item) => !item.deletedAt)
      .findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.list[index].deletedAt = new Date();
    return true;
  }
}
