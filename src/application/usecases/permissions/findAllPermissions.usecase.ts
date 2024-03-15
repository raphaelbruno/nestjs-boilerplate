import { Injectable } from '@nestjs/common';
import { Paginated } from 'src/domain/models/commons/paginated';
import { PaginatedQuery } from 'src/domain/models/commons/paginatedQuery';
import { Permission } from 'src/domain/models/permission';
import { PermissionsRepositoryInterface } from 'src/domain/repositories/permissions.interface';

@Injectable()
export class FindAllPermissionsUseCase {
  constructor(
    private readonly permissionsRepository: PermissionsRepositoryInterface,
  ) {}

  async execute(params?: PaginatedQuery): Promise<Paginated<Permission>> {
    return await this.permissionsRepository.findAll(params);
  }
}
