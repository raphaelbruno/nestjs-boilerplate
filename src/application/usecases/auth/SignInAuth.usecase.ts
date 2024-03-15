import { Injectable } from '@nestjs/common';
import { UserInvalidCredentialsException } from 'src/application/exceptions/userInvalidCredentials.exception';
import { objectToPlain } from 'src/application/helpers/object.helper';
import { comparePasswordHash } from 'src/application/helpers/security.helper';
import { Auth } from 'src/domain/models/auth';
import { User } from 'src/domain/models/user';
import { TokenRepositoryInterface } from 'src/domain/repositories/token.interface';
import { UsersRepositoryInterface } from 'src/domain/repositories/users.interface';

@Injectable()
export class SignInAuthUseCase {
  constructor(
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly tokenRepository: TokenRepositoryInterface,
  ) {}

  async execute(
    username: string,
    password: string,
    payloadMapper?: (user: User) => any,
  ): Promise<Auth> {
    const user = await this.usersRepository.findOneByEmail(username);

    if (!user || !(await comparePasswordHash(password, user.password)))
      throw new UserInvalidCredentialsException();

    const payload = objectToPlain(payloadMapper ? payloadMapper(user) : user);

    const access_token = await this.tokenRepository.sign(payload);

    this.tokenRepository.registerToken(user, access_token);

    return new Auth({
      access_token,
      user: new User(payload),
    });
  }
}
