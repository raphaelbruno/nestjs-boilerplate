import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SignInAuthUseCase } from 'src/application/usecases/auth/SignInAuth.usecase';
import { GenerateTokenAuthUseCase } from 'src/application/usecases/auth/generateTokenAuth.usecase';
import { FindOneUserUseCase } from 'src/application/usecases/users/findOneUser.usecase';
import { TokenRepositoryInterface } from 'src/domain/repositories/token.interface';
import { UsersRepositoryInterface } from 'src/domain/repositories/users.interface';
import { AuthController } from 'src/presentation/controllers/auth.controller';
import { TokenRepository } from '../repositories/token.repository';
import { UsersRepository } from '../repositories/users.repository';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    SignInAuthUseCase,
    GenerateTokenAuthUseCase,
    FindOneUserUseCase,

    {
      provide: TokenRepositoryInterface,
      useClass: TokenRepository,
    },
    {
      provide: UsersRepositoryInterface,
      useClass: UsersRepository,
    },
  ],
})
export class AuthModule {}
