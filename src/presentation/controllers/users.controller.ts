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
import { ConflictException } from 'src/application/exceptions/conflict.exception';
import { AssignRolesUserUseCase } from 'src/application/usecases/users/assignRolesUser.usecase';
import { ChangePasswordUserUseCase } from 'src/application/usecases/users/changePasswordUser.usecase';
import { CreateUserUseCase } from 'src/application/usecases/users/createUser.usecase';
import { DeleteUserUseCase } from 'src/application/usecases/users/deleteUser.usecase';
import { FindAllUsersUseCase } from 'src/application/usecases/users/findAllUsers.usecase';
import { FindOneUserUseCase } from 'src/application/usecases/users/findOneUser.usecase';
import { UpdateUserUseCase } from 'src/application/usecases/users/updateUser.usecase';
import { Paginated } from 'src/domain/models/commons/paginated';
import { PermissionKey } from 'src/domain/models/enums/permission.enum';
import { User } from 'src/domain/models/user';
import { GenericMapper } from 'src/presentation/mappers/generic.mapper';
import { ApiResponseSchema } from '../decorators/apiResponseSchema.decorator';
import { ApiResponseSchemaPaginated } from '../decorators/apiResponseSchemaPaginated.decorator';
import { Permissions } from '../decorators/permissions.decorator';
import {
  PaginatedQueryRequest,
  PaginatedResponse,
} from '../schemas/paginated.schema';
import {
  UserCompleteResponse,
  UserCreate,
  UserPasswordUpdate,
  UserResponse,
  UserRolesAsign,
  UserUpdate,
} from '../schemas/user.schema';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly changePasswordUserUseCase: ChangePasswordUserUseCase,
    private readonly assignRolesUserUseCase: AssignRolesUserUseCase,
  ) {}

  @Put('change-password')
  @ApiResponseSchema(UserCompleteResponse)
  async changePassword(
    @Request() { user },
    @Body() { password }: UserPasswordUpdate,
  ): Promise<UserCompleteResponse> {
    try {
      return GenericMapper.getInstance(UserCompleteResponse).toSchema(
        await this.changePasswordUserUseCase.execute(user, user.id, password),
      );
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      if (error instanceof ForbiddenException)
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);

      throw error;
    }
  }

  @Get()
  @Permissions(PermissionKey.UserRead)
  @ApiResponseSchemaPaginated(UserResponse)
  async findAll(
    @Request() { user },
    @Query() params?: PaginatedQueryRequest,
  ): Promise<PaginatedResponse<UserResponse>> {
    const paginatedUsers: Paginated<User> =
      await this.findAllUsersUseCase.execute(user, params);

    return new PaginatedResponse<UserResponse>({
      ...paginatedUsers,
      data: paginatedUsers.data.map(
        GenericMapper.getInstance(UserResponse).toSchema,
      ),
    });
  }

  @Get(':id')
  @Permissions(PermissionKey.UserRead)
  @ApiResponseSchema(UserCompleteResponse)
  async findOne(
    @Request() { user },
    @Param('id') id: number,
  ): Promise<UserCompleteResponse> {
    try {
      const item: User = await this.findOneUserUseCase.execute(user, id);

      return GenericMapper.getInstance(UserCompleteResponse).toSchema(item);
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      if (error instanceof ForbiddenException)
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);

      throw error;
    }
  }

  @Post()
  @Permissions(PermissionKey.UserCreate)
  @ApiResponseSchema(UserCompleteResponse)
  async create(@Body() item: UserCreate): Promise<UserCompleteResponse> {
    try {
      return GenericMapper.getInstance(UserCompleteResponse).toSchema(
        await this.createUserUseCase.execute(new User(item)),
      );
    } catch (error) {
      if (error instanceof ConflictException)
        throw new HttpException(error.message, HttpStatus.CONFLICT);

      throw error;
    }
  }

  @Put(':id')
  @Permissions(PermissionKey.UserUpdate)
  @ApiResponseSchema(UserCompleteResponse)
  async update(
    @Request() { user },
    @Param('id') id: number,
    @Body() data: UserUpdate,
  ): Promise<UserCompleteResponse> {
    try {
      return GenericMapper.getInstance(UserCompleteResponse).toSchema(
        await this.updateUserUseCase.execute(user, new User({ ...data, id })),
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
  @Permissions(PermissionKey.UserDelete)
  async delete(@Request() { user }, @Param('id') id: number): Promise<null> {
    try {
      await this.deleteUserUseCase.execute(user, id);
      return null;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      if (error instanceof ForbiddenException)
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);

      throw error;
    }
  }

  @Post(':id/assign-roles')
  @Permissions(PermissionKey.UserUpdate)
  @ApiResponseSchema(UserCompleteResponse)
  async assignRoles(
    @Request() { user },
    @Param('id') id: number,
    @Body() { rolesId }: UserRolesAsign,
  ): Promise<UserCompleteResponse> {
    try {
      return GenericMapper.getInstance(UserCompleteResponse).toSchema(
        await this.assignRolesUserUseCase.execute(user, id, rolesId),
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
