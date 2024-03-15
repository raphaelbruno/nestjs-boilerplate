import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserInvalidCredentialsException } from 'src/application/exceptions/userInvalidCredentials.exception';
import { SignInAuthUseCase } from 'src/application/usecases/auth/SignInAuth.usecase';
import { GenerateTokenAuthUseCase } from 'src/application/usecases/auth/generateTokenAuth.usecase';
import { FindOneUserUseCase } from 'src/application/usecases/users/findOneUser.usecase';
import { Auth } from 'src/domain/models/auth';
import { GenericMapper } from 'src/presentation/mappers/generic.mapper';
import { Public } from '../decorators/public.decorator';
import { AuthLogin, AuthResponse } from '../schemas/auth.schema';
import { UserCompleteResponse } from '../schemas/user.schema';
import { User } from 'src/domain/models/user';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly signInAuthUseCase: SignInAuthUseCase,
    private readonly generateTokenAuthUsecase: GenerateTokenAuthUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiResponse({ type: AuthResponse })
  async login(@Body() credentials: AuthLogin): Promise<AuthResponse> {
    try {
      const auth: Auth = await this.signInAuthUseCase.execute(
        credentials.username,
        credentials.password,
        GenericMapper.getInstance(UserCompleteResponse).toSchema,
      );

      return GenericMapper.getInstance(AuthResponse).toSchema({
        ...auth,
        user: GenericMapper.getInstance(UserCompleteResponse).toSchema(
          auth.user,
        ),
      });
    } catch (error) {
      if (
        error instanceof UserInvalidCredentialsException ||
        error instanceof NotFoundException
      )
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);

      throw error;
    }
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiResponse({ type: UserCompleteResponse })
  async me(@Request() { user }): Promise<UserCompleteResponse> {
    return GenericMapper.getInstance(UserCompleteResponse).toSchema(
      await this.findOneUserUseCase.execute(new User(user), user.id),
    );
  }

  @Get('refresh')
  @ApiBearerAuth()
  @ApiResponse({ type: AuthResponse })
  async refresh(@Request() { user }): Promise<AuthResponse> {
    try {
      const auth: Auth = await this.generateTokenAuthUsecase.execute(
        user.id,
        GenericMapper.getInstance(UserCompleteResponse).toSchema,
      );

      return GenericMapper.getInstance(AuthResponse).toSchema({
        ...auth,
        user: GenericMapper.getInstance(UserCompleteResponse).toSchema(
          auth.user,
        ),
      });
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);

      throw error;
    }
  }
}
