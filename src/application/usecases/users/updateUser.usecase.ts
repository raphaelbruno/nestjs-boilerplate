import { Injectable } from '@nestjs/common';
import { ForbiddenException } from 'src/application/exceptions/forbidden.exception';
import { NotFoundException } from 'src/application/exceptions/notFound.exception';
import { User } from 'src/domain/models/user';
import { UsersRepositoryInterface } from 'src/domain/repositories/users.interface';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly usersRepository: UsersRepositoryInterface) {}

  async execute(user: User, data: User): Promise<User | null> {
    const item: User = await this.usersRepository.findOne(data.id);

    if (!item) throw new NotFoundException();

    item.fillCanManageField(user);

    if (!item.canManage) throw new ForbiddenException();

    const updated = await this.usersRepository.update(data);
    if (!updated) return null;

    return updated;
  }
}
