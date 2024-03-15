import { TokenRepositoryInterface } from 'src/domain/repositories/token.interface';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/domain/models/token';

export class TokenInMemoryRepository implements TokenRepositoryInterface {
  private service = new JwtService({
    secret: 'secret',
    signOptions: { expiresIn: '1h' },
  });

  async registerToken(user: any, token: string): Promise<Token> {
    return new Token({
      id: 1,
      token,
      userId: user.id,
      createdAt: new Date(),
    });
  }

  async sign(payload: object | Buffer, options?: any): Promise<string> {
    return await this.service.signAsync(payload, options);
  }

  async verify<T extends object = any>(
    token: string,
    options?: any,
  ): Promise<T> {
    return await this.service.verifyAsync(token, options);
  }

  decode<T = any>(token: string, options?: any): T {
    return this.service.decode(token, options) as T;
  }
}
