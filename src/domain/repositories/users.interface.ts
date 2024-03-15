import { User } from 'src/domain/models/user';
import { UserRole } from '../models/userRole';
import { GenericRepositoryInterface } from './generic.interface';

export abstract class UsersRepositoryInterface extends GenericRepositoryInterface<User> {
  abstract findOneByEmail(email: string): Promise<User | null>;
  abstract changePassword(id: number, password: string): Promise<User | null>;
  abstract addRole(userRole: UserRole): Promise<User | null>;
  abstract removeRole(userRole: UserRole): Promise<User | null>;
}
