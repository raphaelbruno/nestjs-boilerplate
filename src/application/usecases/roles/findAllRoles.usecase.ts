import { Injectable } from '@nestjs/common';
import { Paginated } from 'src/domain/models/commons/paginated';
import { PaginatedQuery } from 'src/domain/models/commons/paginatedQuery';
import { Role } from 'src/domain/models/role';
import { User } from 'src/domain/models/user';
import { RolesRepositoryInterface } from 'src/domain/repositories/roles.interface';

@Injectable()
export class FindAllRolesUseCase {
  constructor(private readonly rolesRepository: RolesRepositoryInterface) {}

  async execute(user: User, params?: PaginatedQuery): Promise<Paginated<Role>> {
    const paginatedRole = await this.rolesRepository.findAll(params);

    paginatedRole.data.forEach((item) => item.fillCanManageField(user));

    return paginatedRole;
  }
}
