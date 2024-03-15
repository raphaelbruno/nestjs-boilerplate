import { User } from './user';

export class Token {
  constructor(data?: Partial<Token>) {
    Object.assign(this, data);
  }

  id?: number;
  token: string;
  userId: number;
  createdAt?: Date;

  user?: User;
}
