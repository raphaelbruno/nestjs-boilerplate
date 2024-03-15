import { User } from './user';

export class Sample {
  constructor(data?: Partial<Sample>) {
    Object.assign(this, data);
  }

  id?: number;
  title: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  user?: User;
}
