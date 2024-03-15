import { Injectable } from '@nestjs/common';
import { NotFoundException } from 'src/application/exceptions/notFound.exception';
import { Sample } from 'src/domain/models/sample';
import { SamplesRepositoryInterface } from 'src/domain/repositories/samples.interface';

@Injectable()
export class UpdateSampleUseCase {
  constructor(private readonly samplesRepository: SamplesRepositoryInterface) {}

  async execute(data: Sample): Promise<Sample | null> {
    if (!(await this.samplesRepository.findOne(data.id)))
      throw new NotFoundException();

    const updated = await this.samplesRepository.update(data);
    if (!updated) return null;

    return updated;
  }
}
