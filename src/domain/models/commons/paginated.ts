interface PaginatedParams<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export class Paginated<T> {
  constructor(data: PaginatedParams<T>) {
    Object.assign(this, data);
  }

  data: T[];
  total: number;
  page: number;
  limit: number;
}
