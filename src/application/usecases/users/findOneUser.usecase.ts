import { Injectable } from '@nestjs/common';
import { ForbiddenException } from 'src/application/exceptions/forbidden.exception';
import { NotFoundException } from 'src/application/exceptions/notFound.exception';
import { User } from 'src/domain/models/user';
import { UsersRepositoryInterface } from 'src/domain/repositories/users.interface';

@Injectable()
export class FindOneUserUseCase {
  constructor(private readonly usersRepository: UsersRepositoryInterface) {}

  async execute(user: User, id: number): Promise<User | null> {
    const item: User = await this.usersRepository.findOne(id);

    if (!item) throw new NotFoundException();

    item.fillCanManageField(user);

    if (!item.canManage) throw new ForbiddenException();

    return item;
  }
}
