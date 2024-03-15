import { Injectable } from '@nestjs/common';
import {
  autoFillPaginatedQuery,
  generateOrderBy,
  generateWhere,
} from 'src/application/helpers/paginated.helper';
import { Paginated } from 'src/domain/models/commons/paginated';
import { PaginatedQuery } from 'src/domain/models/commons/paginatedQuery';
import { GenericRepositoryInterface } from 'src/domain/repositories/generic.interface';
import { PrismaService } from 'src/infrastructure/database/prisma.services';
import { GenericMapper } from '../../presentation/mappers/generic.mapper';

@Injectable()
export class GenericRepository<T> implements GenericRepositoryInterface<T> {
  constructor(protected prisma: PrismaService) {}

  protected table: string;
  protected searchFields: string[] = ['name'];
  protected relationship: object = {};

  async findAll(params?: PaginatedQuery): Promise<Paginated<T>> {
    const { q, page, limit, sort, order } = autoFillPaginatedQuery(params);
    const where = generateWhere(q, this.searchFields);
    const [total, listFromDatabase] = await this.prisma.$transaction([
      this.prisma[this.table].count({ where }),
      this.prisma[this.table].findMany({
        ...this.relationship,
        skip: (page - 1) * limit,
        take: limit,
        where,
        orderBy: generateOrderBy(sort, order),
      }),
    ]);

    return new Paginated<T>({
      data: listFromDatabase as T[],
      total,
      page,
      limit,
    });
  }

  async findOne(id: number): Promise<T | null> {
    const itemFromDatabase = await this.prisma[this.table].findUnique({
      ...this.relationship,
      where: { id, deletedAt: null },
    });

    if (!itemFromDatabase) return null;

    return itemFromDatabase as T;
  }

  async create(item: T): Promise<T> {
    const itemFromDatabase = await this.prisma[this.table].create({
      data: GenericMapper.toPlain(item),
    });

    return itemFromDatabase as T;
  }

  async update(item: T | any): Promise<T | null> {
    const itemFromDatabase = await this.prisma[this.table].update({
      where: { id: item.id, deletedAt: null },
      data: GenericMapper.toPlain(item),
    });

    if (!itemFromDatabase) return null;

    return itemFromDatabase as T;
  }

  async delete(id: number): Promise<boolean> {
    const itemFromDatabase = await this.prisma[this.table].update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return itemFromDatabase ? true : false;
  }
}
