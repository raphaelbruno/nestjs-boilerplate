import {
  defaultPaginatedQuery,
  generateWhere,
  generateOrderBy,
  autoFillPaginatedQuery,
} from './paginated.helper';

describe('PaginatedHelper', () => {
  it('should return default paginated query', () => {
    const paginatedQuery = defaultPaginatedQuery();
    expect(paginatedQuery).toEqual(
      expect.objectContaining({
        q: expect.any(String),
        page: expect.any(Number),
        limit: expect.any(Number),
        sort: expect.any(String),
        order: expect.stringMatching(/\S/),
      }),
    );
  });

  it('should return where query', () => {
    const q = 'test';
    const fields = ['name', 'email'];

    expect(generateWhere(q, fields)).toEqual(
      expect.objectContaining({
        deletedAt: null,
        OR: expect.arrayContaining([
          expect.objectContaining({ name: { contains: q } }),
          expect.objectContaining({ email: { contains: q } }),
        ]),
      }),
    );

    const emptyReturnedWhere: Record<string, any> = {
      deletedAt: null,
    };

    expect(generateWhere('', fields)).toEqual(emptyReturnedWhere);
    expect(generateWhere(null, fields)).toEqual(emptyReturnedWhere);
    expect(generateWhere(q, [])).toEqual(emptyReturnedWhere);
  });

  it('should return order by query', () => {
    const sort = 'name, email';
    const order = 'asc';

    expect(generateOrderBy(sort, order)).toEqual(
      expect.arrayContaining([{ name: order }, { email: order }]),
    );

    expect(generateOrderBy('', order)).toEqual(expect.arrayContaining([]));
  });

  it('should return auto fill paginated query', () => {
    expect(
      autoFillPaginatedQuery({
        q: 'test',
        page: 1,
        limit: 10,
        sort: 'name, email',
        order: 'asc',
      }),
    ).toEqual(
      expect.objectContaining({
        q: 'test',
        page: 1,
        limit: 10,
        sort: 'name, email',
        order: 'asc',
      }),
    );

    expect(autoFillPaginatedQuery(null)).toEqual(
      expect.objectContaining({
        q: expect.any(String),
        page: expect.any(Number),
        limit: expect.any(Number),
        sort: expect.any(String),
        order: expect.stringMatching(/\S/),
      }),
    );
  });
});
