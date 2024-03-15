import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TokenRepositoryInterface } from './domain/repositories/token.interface';
import { AuthGuard } from './infrastructure/auth/auth.guard';
import { PrismaService } from './infrastructure/database/prisma.services';
import { AuthModule } from './infrastructure/modules/auth.module';
import { PermissionsModule } from './infrastructure/modules/permissions.module';
import { RolesModule } from './infrastructure/modules/roles.module';
import { UsersModule } from './infrastructure/modules/users.module';
import { TokenRepository } from './infrastructure/repositories/token.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaService.forRoot(),

    AuthModule,

    UsersModule,
    RolesModule,
    PermissionsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: TokenRepositoryInterface,
      useClass: TokenRepository,
    },
  ],
})
export class AppModule {}
