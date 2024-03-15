import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PaginatedQueryPipe } from './infrastructure/pipes/paginatedQuery.pipe';
import { PaginatedQueryRequest } from './presentation/schemas/paginated.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle(process.env.API_NAME)
    .setVersion(process.env.API_VERSION)
    .setDescription(process.env.API_DESCRIPTION)
    .addBearerAuth()
    .build();

  app.useGlobalPipes(
    new PaginatedQueryPipe([PaginatedQueryRequest]),
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
