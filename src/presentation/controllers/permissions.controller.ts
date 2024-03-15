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
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConflictException } from 'src/application/exceptions/conflict.exception';
import { NotFoundException } from 'src/application/exceptions/notFound.exception';
import { CreatePermissionUseCase } from 'src/application/usecases/permissions/createPermission.usecase';
import { DeletePermissionUseCase } from 'src/application/usecases/permissions/deletePermission.usecase';
import { FindAllPermissionsUseCase } from 'src/application/usecases/permissions/findAllPermissions.usecase';
import { FindOnePermissionUseCase } from 'src/application/usecases/permissions/findOnePermission.usecase';
import { UpdatePermissionUseCase } from 'src/application/usecases/permissions/updatePermission.usecase';
import { Paginated } from 'src/domain/models/commons/paginated';
import { PermissionKey } from 'src/domain/models/enums/permission.enum';
import { Permission } from 'src/domain/models/permission';
import { GenericMapper } from 'src/presentation/mappers/generic.mapper';
import { ApiResponseSchema } from '../decorators/apiResponseSchema.decorator';
import { ApiResponseSchemaPaginated } from '../decorators/apiResponseSchemaPaginated.decorator';
import { Permissions } from '../decorators/permissions.decorator';
import {
  PaginatedQueryRequest,
  PaginatedResponse,
} from '../schemas/paginated.schema';
import {
  PermissionCreate,
  PermissionResponse,
  PermissionUpdate,
} from '../schemas/permission.schema';

@ApiBearerAuth()
@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly findAllPermissionsUseCase: FindAllPermissionsUseCase,
    private readonly findOnePermissionsUseCase: FindOnePermissionUseCase,
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly updatePermissionUseCase: UpdatePermissionUseCase,
    private readonly deletePermissionUseCase: DeletePermissionUseCase,
  ) {}

  @Get()
  @Permissions(PermissionKey.PermissionRead)
  @ApiResponseSchemaPaginated(PermissionResponse)
  async findAll(
    @Query() params?: PaginatedQueryRequest,
  ): Promise<PaginatedResponse<PermissionResponse>> {
    const paginatedPermissions: Paginated<Permission> =
      await this.findAllPermissionsUseCase.execute(params);

    return new PaginatedResponse<PermissionResponse>({
      ...paginatedPermissions,
      data: paginatedPermissions.data.map(
        GenericMapper.getInstance(PermissionResponse).toSchema,
      ),
    });
  }

  @Get(':id')
  @Permissions(PermissionKey.PermissionRead)
  @ApiResponseSchema(PermissionResponse)
  async findOne(@Param('id') id: number): Promise<PermissionResponse> {
    try {
      const item: Permission = await this.findOnePermissionsUseCase.execute(id);

      return GenericMapper.getInstance(PermissionResponse).toSchema(item);
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);

      throw error;
    }
  }

  @Post()
  @Permissions(PermissionKey.PermissionCreate)
  @ApiResponse({ type: PermissionResponse })
  async create(@Body() item: PermissionCreate): Promise<PermissionResponse> {
    try {
      return GenericMapper.getInstance(PermissionResponse).toSchema(
        await this.createPermissionUseCase.execute(new Permission(item)),
      );
    } catch (error) {
      if (error instanceof ConflictException)
        throw new HttpException(error.message, HttpStatus.CONFLICT);

      throw error;
    }
  }

  @Put(':id')
  @Permissions(PermissionKey.PermissionUpdate)
  @ApiResponse({ type: PermissionResponse })
  async update(
    @Param('id') id: number,
    @Body() data: PermissionUpdate,
  ): Promise<PermissionResponse> {
    try {
      return GenericMapper.getInstance(PermissionResponse).toSchema(
        await this.updatePermissionUseCase.execute(
          new Permission({ ...data, id }),
        ),
      );
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);

      throw error;
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Permissions(PermissionKey.PermissionDelete)
  async delete(@Param('id') id: number): Promise<null> {
    try {
      await this.deletePermissionUseCase.execute(id);
      return null;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);

      throw error;
    }
  }
}
