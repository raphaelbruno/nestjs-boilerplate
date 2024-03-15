import { Injectable } from '@nestjs/common';
import { ForbiddenException } from 'src/application/exceptions/forbidden.exception';
import { NotFoundException } from 'src/application/exceptions/notFound.exception';
import { User } from 'src/domain/models/user';
import { UsersRepositoryInterface } from 'src/domain/repositories/users.interface';

@Injectable()
export class ChangePasswordUserUseCase {
  constructor(private readonly usersRepository: UsersRepositoryInterface) {}

  async execute(
    user: User,
    id: number,
    password: string,
  ): Promise<User | null> {
    const item: User = await this.usersRepository.findOne(id);

    if (!item) throw new NotFoundException();

    item.fillCanManageField(user);

    if (!item.canManage) throw new ForbiddenException();

    const updated = await this.usersRepository.changePassword(id, password);
    if (!updated) return null;

    return updated;
  }
}
