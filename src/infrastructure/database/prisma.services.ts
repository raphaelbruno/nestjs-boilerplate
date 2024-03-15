import { DynamicModule, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super(
      process.env.DEBUG === 'true'
        ? { log: ['query', 'info', 'warn', 'error'] }
        : {},
    );
  }

  async onModuleInit() {
    await this.$connect();
  }

  static forRoot(): DynamicModule {
    return {
      global: true,
      module: PrismaService,
      providers: [PrismaService],
      exports: [PrismaService],
    };
  }
}
