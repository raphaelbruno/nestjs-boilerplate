import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiResponseSchema = <T extends Type<unknown>>(schema: T) =>
  applyDecorators(
    ApiExtraModels(schema),
    ApiResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(schema) }],
      },
    }),
  );
