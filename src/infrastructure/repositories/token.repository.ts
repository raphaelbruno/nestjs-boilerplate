import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/domain/models/token';
import { User } from 'src/domain/models/user';
import { TokenRepositoryInterface } from 'src/domain/repositories/token.interface';
import { PrismaService } from '../database/prisma.services';
import { GenericMapper } from 'src/presentation/mappers/generic.mapper';

@Injectable()
export class TokenRepository implements TokenRepositoryInterface {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: JwtService,
  ) {}

  async registerToken(user: User, token: string): Promise<Token> {
    const tokenDecoded = this.decode(token);
    const itemFromDatabase = await this.prisma.tokens.create({
      data: {
        token,
        userId: user.id,
        createdAt: new Date(tokenDecoded.iat * 1000),
        expiredAt: new Date(tokenDecoded.exp * 1000),
      },
    });

    return GenericMapper.getInstance(Token).toModel(itemFromDatabase);
  }

  async sign(payload: object | Buffer, options?: any): Promise<string> {
    return await this.tokenService.sign(payload, options);
  }

  async verify<T extends object = any>(
    token: string,
    options?: any,
  ): Promise<T> {
    return await this.tokenService.verify(token, options);
  }

  decode<T = any>(token: string, options?: any): T {
    return this.tokenService.decode(token, options);
  }
}
