import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ForbiddenException } from 'src/application/exceptions/forbidden.exception';
import { NotFoundException } from 'src/application/exceptions/notFound.exception';
import { AssignPermissionsRoleUseCase } from 'src/application/usecases/roles/assignPermissionsUser.usecase';
import { CreateRoleUseCase } from 'src/application/usecases/roles/createRole.usecase';
import { DeleteRoleUseCase } from 'src/application/usecases/roles/deleteRole.usecase';
import { FindAllRolesUseCase } from 'src/application/usecases/roles/findAllRoles.usecase';
import { FindOneRoleUseCase } from 'src/application/usecases/roles/findOneRole.usecase';
import { UpdateRoleUseCase } from 'src/application/usecases/roles/updateRole.usecase';
import { Paginated } from 'src/domain/models/commons/paginated';
import { PermissionKey } from 'src/domain/models/enums/permission.enum';
import { Role } from 'src/domain/models/role';
import { GenericMapper } from 'src/presentation/mappers/generic.mapper';
import { ApiResponseSchema } from '../decorators/apiResponseSchema.decorator';
import { ApiResponseSchemaPaginated } from '../decorators/apiResponseSchemaPaginated.decorator';
import { Permissions } from '../decorators/permissions.decorator';
import {
  PaginatedQueryRequest,
  PaginatedResponse,
} from '../schemas/paginated.schema';
import {
  RoleCompleteResponse,
  RoleCreate,
  RolePermissionsAsign,
  RoleResponse,
  RoleUpdate,
} from '../schemas/role.schema';
import { ConflictException } from 'src/application/exceptions/conflict.exception';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly findAllRolesUseCase: FindAllRolesUseCase,
    private readonly findOneRoleUseCase: FindOneRoleUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
    private readonly assignPermissionsRoleUseCase: AssignPermissionsRoleUseCase,
  ) {}

  @Get()
  @Permissions(PermissionKey.RoleRead)
  @ApiResponseSchemaPaginated(RoleResponse)
  async findAll(
    @Request() { user },
    @Query() params?: PaginatedQueryRequest,
  ): Promise<PaginatedResponse<RoleResponse>> {
    const paginatedRoles: Paginated<Role> =
      await this.findAllRolesUseCase.execute(user, params);

    return new PaginatedResponse<RoleResponse>({
      ...paginatedRoles,
      data: paginatedRoles.data.map(
        GenericMapper.getInstance(RoleResponse).toSchema,
      ),
    });
  }

  @Get(':id')
  @Permissions(PermissionKey.RoleRead)
  @ApiResponseSchema(RoleCompleteResponse)
  async findOne(
    @Request() { user },
    @Param('id') id: number,
  ): Promise<RoleCompleteResponse> {
    try {
      const item: Role = await this.findOneRoleUseCase.execute(user, id);

      return GenericMapper.getInstance(RoleCompleteResponse).toSchema(item);
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      if (error instanceof ForbiddenException)
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);

      throw error;
    }
  }

  @Post()
  @Permissions(PermissionKey.RoleCreate)
  @ApiResponseSchema(RoleCompleteResponse)
  async create(
    @Request() { user },
    @Body() item: RoleCreate,
  ): Promise<RoleResponse> {
    try {
      return GenericMapper.getInstance(RoleResponse).toSchema(
        await this.createRoleUseCase.execute(user, new Role(item)),
      );
    } catch (error) {
      if (error instanceof ForbiddenException)
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      if (error instanceof ConflictException)
        throw new HttpException(error.message, HttpStatus.CONFLICT);

      throw error;
    }
  }

  @Put(':id')
  @Permissions(PermissionKey.RoleUpdate)
  @ApiResponseSchema(RoleCompleteResponse)
  async update(
    @Request() { user },
    @Param('id') id: number,
    @Body() data: RoleUpdate,
  ): Promise<RoleResponse> {
    try {
      return GenericMapper.getInstance(RoleResponse).toSchema(
        await this.updateRoleUseCase.execute(user, new Role({ ...data, id })),
      );
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      if (error instanceof ForbiddenException)
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);

      throw error;
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Permissions(PermissionKey.RoleDelete)
  async delete(@Request() { user }, @Param('id') id: number): Promise<null> {
    try {
      await this.deleteRoleUseCase.execute(user, id);
      return null;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      if (error instanceof ForbiddenException)
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);

      throw error;
    }
  }

  @Post(':id/assign-permissions')
  @Permissions(PermissionKey.UserUpdate)
  @ApiResponseSchema(RoleCompleteResponse)
  async assignPermissions(
    @Request() { user },
    @Param('id') id: number,
    @Body() { permissionsId }: RolePermissionsAsign,
  ): Promise<RoleCompleteResponse> {
    try {
      return GenericMapper.getInstance(RoleCompleteResponse).toSchema(
        await this.assignPermissionsRoleUseCase.execute(
          user,
          id,
          permissionsId,
        ),
      );
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      if (error instanceof ForbiddenException)
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);

      throw error;
    }
  }
}
