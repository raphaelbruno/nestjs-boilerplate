import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResponse } from '../schemas/paginated.schema';

export const ApiResponseSchemaPaginated = <T extends Type<unknown>>(
  schema: T,
) =>
  applyDecorators(
    ApiExtraModels(PaginatedResponse, schema),
    ApiResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(schema) },
              },
            },
          },
        ],
      },
    }),
  );
