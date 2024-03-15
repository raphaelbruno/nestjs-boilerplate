import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/models/user';
import { UsersRepositoryInterface } from 'src/domain/repositories/users.interface';
import { ConflictException } from '../../exceptions/conflict.exception';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly usersRepository: UsersRepositoryInterface) {}

  async execute(data: User): Promise<User> {
    if (await this.usersRepository.findOneByEmail(data.email))
      throw new ConflictException();

    return await this.usersRepository.create(data);
  }
}
