import { Injectable } from '@nestjs/common';
import { Paginated } from 'src/domain/models/commons/paginated';
import { PaginatedQuery } from 'src/domain/models/commons/paginatedQuery';
import { User } from 'src/domain/models/user';
import { UsersRepositoryInterface } from 'src/domain/repositories/users.interface';

@Injectable()
export class FindAllUsersUseCase {
  constructor(private readonly usersRepository: UsersRepositoryInterface) {}

  async execute(user: User, params?: PaginatedQuery): Promise<Paginated<User>> {
    const paginatedUser = await this.usersRepository.findAll(params);

    paginatedUser.data.forEach((item) => item.fillCanManageField(user));

    return paginatedUser;
  }
}
