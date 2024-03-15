import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Paginated } from 'src/domain/models/commons/paginated';
import { PaginatedQuery } from 'src/domain/models/commons/paginatedQuery';

export class PaginatedQueryRequest implements PaginatedQuery {
  @ApiPropertyOptional()
  @IsOptional()
  q?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: string;
}

export class PaginatedResponse<T> extends Paginated<T> {
  @Expose()
  @ApiProperty()
  readonly data: T[];

  @Expose()
  @ApiProperty()
  readonly page: number;

  @Expose()
  @ApiProperty()
  readonly limit: number;

  @Expose()
  @ApiProperty()
  readonly total: number;

  @Expose()
  @ApiProperty()
  previousPage(): number | null {
    return this.page > 1 ? this.page - 1 : null;
  }

  @Expose()
  @ApiProperty()
  nextPage(): number | null {
    return this.page < this.lastPage() ? this.page + 1 : null;
  }

  @Expose()
  @ApiProperty()
  lastPage(): number {
    return Math.ceil(this.total / this.limit);
  }
}
