import { Injectable } from '@nestjs/common';
import { NotFoundException } from 'src/application/exceptions/notFound.exception';
import { objectToPlain } from 'src/application/helpers/object.helper';
import { Auth } from 'src/domain/models/auth';
import { User } from 'src/domain/models/user';
import { TokenRepositoryInterface } from 'src/domain/repositories/token.interface';
import { UsersRepositoryInterface } from 'src/domain/repositories/users.interface';

@Injectable()
export class GenerateTokenAuthUseCase {
  constructor(
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly tokenRepository: TokenRepositoryInterface,
  ) {}

  async execute(
    id: number,
    payloadMapper?: (user: User) => any,
  ): Promise<Auth> {
    const user = await this.usersRepository.findOne(id);

    if (!user) throw new NotFoundException();

    const payload = objectToPlain(payloadMapper ? payloadMapper(user) : user);

    const access_token = await this.tokenRepository.sign(payload);

    this.tokenRepository.registerToken(user, access_token);

    return new Auth({
      access_token,
      user: new User(payload),
    });
  }
}
