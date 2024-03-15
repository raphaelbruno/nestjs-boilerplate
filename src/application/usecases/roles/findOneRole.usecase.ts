import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from 'src/domain/models/role';
import { User } from 'src/domain/models/user';
import { RolesRepositoryInterface } from 'src/domain/repositories/roles.interface';

@Injectable()
export class FindOneRoleUseCase {
  constructor(private readonly rolesRepository: RolesRepositoryInterface) {}

  async execute(user: User, id: number): Promise<Role | null> {
    const item: Role = await this.rolesRepository.findOne(id);

    if (!item) throw new NotFoundException();

    item.fillCanManageField(user);

    if (!item.canManage) throw new ForbiddenException();

    return item;
  }
}
