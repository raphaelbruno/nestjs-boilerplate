import { generatePasswordHash } from 'src/application/helpers/security.helper';
import { User } from 'src/domain/models/user';
import { UsersRepositoryInterface } from 'src/domain/repositories/users.interface';
import { GenericInMemoryRepository } from './generic.database';
import { UserRole } from 'src/domain/models/userRole';

export class UsersInMemoryRepository
  extends GenericInMemoryRepository<User>
  implements UsersRepositoryInterface
{
  async create(data: User): Promise<User> {
    const newItem = new User({
      ...data,
      id: data.id ?? this.list.length + 1,
      password: await generatePasswordHash(data.password),
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: data.roles ?? [],
    });
    this.list.push(newItem);
    return newItem;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.list.filter(
      (item) => !item.deletedAt && item.email === email,
    )[0];
  }

  async findOne(id: number): Promise<User | null> {
    const item = await super.findOne(id);
    return item ? new User(item) : null;
  }

  async changePassword(id: number, password: string): Promise<User> {
    const index = this.list
      .filter((item) => !item.deletedAt)
      .findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.list[index].password = await generatePasswordHash(password);
    return this.list[index];
  }

  async addRole(userRole: UserRole): Promise<User> {
    const index = this.list
      .filter((item) => !item.deletedAt)
      .findIndex((item) => item.id === userRole.userId);
    if (index === -1) return null;
    this.list[index].roles.push(userRole);
    return this.list[index];
  }

  async removeRole(userRole: UserRole): Promise<User> {
    const index = this.list
      .filter((item) => !item.deletedAt)
      .findIndex((item) => item.id === userRole.userId);
    if (index === -1) return null;
    this.list[index].roles = this.list[index].roles.filter(
      (item) => item.id !== userRole.roleId,
    );
    return this.list[index];
  }
}
