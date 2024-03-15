import { Injectable } from '@nestjs/common';
import { generatePasswordHash } from 'src/application/helpers/security.helper';
import { Paginated } from 'src/domain/models/commons/paginated';
import { PaginatedQuery } from 'src/domain/models/commons/paginatedQuery';
import { User } from 'src/domain/models/user';
import { UserRole } from 'src/domain/models/userRole';
import { UsersRepositoryInterface } from 'src/domain/repositories/users.interface';
import { GenericMapper } from '../../presentation/mappers/generic.mapper';
import { GenericRepository } from './generic.repository';

@Injectable()
export class UsersRepository
  extends GenericRepository<User>
  implements UsersRepositoryInterface
{
  protected table = 'users';
  protected searchFields: string[] = ['email'];
  protected relationship = {
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  };

  async findAll(params?: PaginatedQuery): Promise<Paginated<User>> {
    const paginated: any = await super.findAll(params);

    return new Paginated<User>({
      ...paginated,
      data: paginated.data.map(User.withRolesPermissions),
    });
  }

  async findOne(id: number): Promise<User> {
    const itemFromDatabase: any = await super.findOne(id);
    if (!itemFromDatabase) return null;

    return User.withRolesPermissions(itemFromDatabase);
  }

  async create(item: User): Promise<User> {
    const itemFromDatabase = await this.prisma[this.table].create({
      data: {
        ...GenericMapper.toPlain(item),
        password: await generatePasswordHash(item.password),
      },
    });

    return GenericMapper.getInstance(User).toModel(itemFromDatabase);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const itemFromDatabase = await this.prisma[this.table].findUnique({
      where: { email, deletedAt: null },
      ...this.relationship,
    });

    if (!itemFromDatabase) return null;

    return User.withRolesPermissions(itemFromDatabase);
  }

  async changePassword(id: number, password: string): Promise<User | null> {
    const itemFromDatabase = await this.prisma.users.update({
      where: { id: id, deletedAt: null },
      data: { password: await generatePasswordHash(password) },
    });

    if (!itemFromDatabase) return null;

    return GenericMapper.getInstance(User).toModel(itemFromDatabase);
  }

  async addRole(userRole: UserRole): Promise<User | null> {
    const itemFromDatabase = await this.prisma.users.update({
      where: { id: userRole.userId, deletedAt: null },
      data: {
        roles: {
          create: { roleId: userRole.roleId, assignedBy: userRole.assignedBy },
        },
      },
    });

    if (!itemFromDatabase) return null;

    return GenericMapper.getInstance(User).toModel(itemFromDatabase);
  }

  async removeRole(userRole: UserRole): Promise<User | null> {
    const itemFromDatabase = await this.prisma.users.update({
      where: { id: userRole.userId, deletedAt: null },
      data: {
        roles: {
          deleteMany: { roleId: userRole.roleId },
        },
      },
    });

    if (!itemFromDatabase) return null;

    return GenericMapper.getInstance(User).toModel(itemFromDatabase);
  }
}
