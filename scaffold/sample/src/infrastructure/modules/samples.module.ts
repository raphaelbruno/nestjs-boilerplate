import { Module } from '@nestjs/common';
import { CreateSampleUseCase } from 'src/application/usecases/samples/createSample.usecase';
import { DeleteSampleUseCase } from 'src/application/usecases/samples/deleteSample.usecase';
import { FindAllSamplesUseCase } from 'src/application/usecases/samples/findAllSamples.usecase';
import { FindOneSampleUseCase } from 'src/application/usecases/samples/findOneSample.usecase';
import { UpdateSampleUseCase } from 'src/application/usecases/samples/updateSample.usecase';
import { SamplesRepositoryInterface } from 'src/domain/repositories/samples.interface';
import { SamplesController } from 'src/presentation/controllers/samples.controller';
import { SamplesRepository } from '../repositories/samples.repository';

@Module({
  controllers: [SamplesController],
  providers: [
    FindAllSamplesUseCase,
    FindOneSampleUseCase,
    CreateSampleUseCase,
    UpdateSampleUseCase,
    DeleteSampleUseCase,
    {
      provide: SamplesRepositoryInterface,
      useClass: SamplesRepository,
    },
  ],
})
export class SamplesModule {}
