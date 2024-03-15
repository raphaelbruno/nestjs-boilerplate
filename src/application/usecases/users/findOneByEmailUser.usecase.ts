import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/models/user';
import { UsersRepositoryInterface } from 'src/domain/repositories/users.interface';

@Injectable()
export class FindEmailUserUseCase {
  constructor(private readonly usersRepository: UsersRepositoryInterface) {}

  async execute(email: string): Promise<User | null> {
    return await this.usersRepository.findOneByEmail(email);
  }
}
