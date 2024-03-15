import { PaginatedQuery } from 'src/domain/models/commons/paginatedQuery';

export const defaultPaginatedQuery = (): PaginatedQuery => ({
  q: '',
  page: 1,
  limit: parseInt(process.env.TOTAL_PER_PAGE),
  sort: '',
  order: 'asc',
});

export const generateWhere = (
  q: string,
  fields: string[],
): Record<string, any> => {
  const where = { deletedAt: null };
  if (q && fields.length > 0)
    where['OR'] = [...fields.map((field) => ({ [field]: { contains: q } }))];
  return where;
};

export const generateOrderBy = (
  sort: string,
  order: string,
): Record<string, any>[] => {
  return sort
    .split(',')
    .filter((item) => !!item)
    .map((item) => ({ [item.trim()]: order.trim() }));
};

export const autoFillPaginatedQuery = (
  params: PaginatedQuery,
): PaginatedQuery => {
  if (params) return Object.assign(defaultPaginatedQuery(), params);
  return { ...defaultPaginatedQuery() };
};
