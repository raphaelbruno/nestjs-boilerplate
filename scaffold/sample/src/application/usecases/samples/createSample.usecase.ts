import { Injectable } from '@nestjs/common';
import { Sample } from 'src/domain/models/sample';
import { SamplesRepositoryInterface } from 'src/domain/repositories/samples.interface';

@Injectable()
export class CreateSampleUseCase {
  constructor(private readonly samplesRepository: SamplesRepositoryInterface) {}

  async execute(data: Sample): Promise<Sample> {
    return await this.samplesRepository.create(data);
  }
}
