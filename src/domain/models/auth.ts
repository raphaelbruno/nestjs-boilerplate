import { User } from './user';

export class Auth {
  constructor(data?: Partial<Auth>) {
    Object.assign(this, data);
  }

  user: Partial<User>;
  access_token: string;
}
