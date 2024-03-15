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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotFoundException } from 'src/application/exceptions/notFound.exception';
import { CreateSampleUseCase } from 'src/application/usecases/samples/createSample.usecase';
import { DeleteSampleUseCase } from 'src/application/usecases/samples/deleteSample.usecase';
import { FindAllSamplesUseCase } from 'src/application/usecases/samples/findAllSamples.usecase';
import { FindOneSampleUseCase } from 'src/application/usecases/samples/findOneSample.usecase';
import { UpdateSampleUseCase } from 'src/application/usecases/samples/updateSample.usecase';
import { Paginated } from 'src/domain/models/commons/paginated';
import { Sample } from 'src/domain/models/sample';
import { GenericMapper } from 'src/presentation/mappers/generic.mapper';
import { ApiResponseSchema } from '../decorators/apiResponseSchema.decorator';
import { ApiResponseSchemaPaginated } from '../decorators/apiResponseSchemaPaginated.decorator';
import {
  PaginatedQueryRequest,
  PaginatedResponse,
} from '../schemas/paginated.schema';
import {
  SampleCompleteResponse,
  SampleCreate,
  SampleResponse,
  SampleUpdate,
} from '../schemas/sample.schema';
import { Permissions } from '../decorators/permissions.decorator';
import { PermissionKey } from 'src/domain/models/enums/permission.enum';

@ApiBearerAuth()
@ApiTags('Samples')
@Controller('samples')
export class SamplesController {
  constructor(
    private readonly findAllSamplesUseCase: FindAllSamplesUseCase,
    private readonly findOneSamplesUseCase: FindOneSampleUseCase,
    private readonly createSampleUseCase: CreateSampleUseCase,
    private readonly updateSampleUseCase: UpdateSampleUseCase,
    private readonly deleteSampleUseCase: DeleteSampleUseCase,
  ) {}

  @Get()
  @Permissions(PermissionKey.SampleRead)
  @ApiResponseSchemaPaginated(SampleResponse)
  async findAll(
    @Query() params?: PaginatedQueryRequest,
  ): Promise<PaginatedResponse<SampleResponse>> {
    const paginatedSamples: Paginated<Sample> =
      await this.findAllSamplesUseCase.execute(params);

    return new PaginatedResponse<SampleResponse>({
      ...paginatedSamples,
      data: paginatedSamples.data.map(
        GenericMapper.getInstance(SampleResponse).toSchema,
      ),
    });
  }

  @Get(':id')
  @Permissions(PermissionKey.SampleRead)
  @ApiResponseSchema(SampleCompleteResponse)
  async findOne(@Param('id') id: number): Promise<SampleCompleteResponse> {
    try {
      const sample: Sample = await this.findOneSamplesUseCase.execute(id);

      return GenericMapper.getInstance(SampleCompleteResponse).toSchema(sample);
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);

      throw error;
    }
  }

  @Post()
  @Permissions(PermissionKey.SampleCreate)
  @ApiResponseSchema(SampleCompleteResponse)
  async create(@Body() sample: SampleCreate): Promise<SampleCompleteResponse> {
    return GenericMapper.getInstance(SampleCompleteResponse).toSchema(
      await this.createSampleUseCase.execute(new Sample(sample)),
    );
  }

  @Put(':id')
  @Permissions(PermissionKey.SampleUpdate)
  @ApiResponseSchema(SampleCompleteResponse)
  async update(
    @Param('id') id: number,
    @Body() data: SampleUpdate,
  ): Promise<SampleCompleteResponse> {
    try {
      return GenericMapper.getInstance(SampleCompleteResponse).toSchema(
        await this.updateSampleUseCase.execute(new Sample({ ...data, id })),
      );
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);

      throw error;
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Permissions(PermissionKey.SampleDelete)
  async delete(@Param('id') id: number): Promise<null> {
    try {
      await this.deleteSampleUseCase.execute(id);
      return null;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);

      throw error;
    }
  }
}
