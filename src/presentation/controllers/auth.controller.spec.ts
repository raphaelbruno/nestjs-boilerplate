import { Test, TestingModule } from '@nestjs/testing';
import { SignInAuthUseCase } from 'src/application/usecases/auth/SignInAuth.usecase';
import { GenerateTokenAuthUseCase } from 'src/application/usecases/auth/generateTokenAuth.usecase';
import { CreateUserUseCase } from 'src/application/usecases/users/createUser.usecase';
import { FindOneUserUseCase } from 'src/application/usecases/users/findOneUser.usecase';
import { TokenRepositoryInterface } from 'src/domain/repositories/token.interface';
import { UsersRepositoryInterface } from 'src/domain/repositories/users.interface';
import { makeUser } from 'test/factories/user.factory';
import { TokenInMemoryRepository } from 'test/repositories/token.repository';
import { UsersInMemoryRepository } from 'test/repositories/users.database';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'secret';
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        SignInAuthUseCase,
        GenerateTokenAuthUseCase,
        CreateUserUseCase,
        FindOneUserUseCase,
        {
          provide: TokenRepositoryInterface,
          useClass: TokenInMemoryRepository,
        },
        {
          provide: UsersRepositoryInterface,
          useClass: UsersInMemoryRepository,
        },
      ],
    }).compile();

    controller = app.get<AuthController>(AuthController);
    createUserUseCase = app.get<CreateUserUseCase>(CreateUserUseCase);
  });

  describe('root', () => {
    it('should return Auth with token from login function', async () => {
      const user = makeUser({ deletedAt: null });
      await createUserUseCase.execute(user);

      expect(
        await controller.login({
          username: user.email,
          password: user.password,
        }),
      ).toMatchObject({
        access_token: expect.any(String),
      });
    });

    it('should throw an error when the user is not found from login function', async () => {
      await expect(
        controller.login({
          username: 'username',
          password: 'password',
        }),
      ).rejects.toThrow();
    });

    it('should return User from me function', async () => {
      const user = makeUser({
        deletedAt: null,
      });
      await createUserUseCase.execute(user);

      const auth = await controller.login({
        username: user.email,
        password: user.password,
      });

      expect(await controller.me(auth)).toMatchObject({
        id: user.id,
        email: user.email,
      });
    });

    it('should return Auth with token from refresh function', async () => {
      const user = makeUser({ deletedAt: null });
      await createUserUseCase.execute(user);

      const auth = await controller.login({
        username: user.email,
        password: user.password,
      });

      expect(await controller.refresh(auth)).toMatchObject({
        access_token: expect.any(String),
      });
    });
  });
});
