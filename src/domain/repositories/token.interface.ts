import { Token } from '../models/token';
import { User } from '../models/user';

export abstract class TokenRepositoryInterface {
  abstract registerToken(user: User, token: string): Promise<Token>;
  abstract sign(payload: Buffer | object, options?: any): Promise<string>;
  abstract verify<T extends object = any>(
    token: string,
    options?: any,
  ): Promise<T>;
  abstract decode<T = any>(token: string, options?: any): T;
}
