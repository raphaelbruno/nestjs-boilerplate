export abstract class PaginatedQuery {
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
}
