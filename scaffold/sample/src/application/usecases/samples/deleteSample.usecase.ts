import { Injectable } from '@nestjs/common';
import { NotFoundException } from 'src/application/exceptions/notFound.exception';
import { SamplesRepositoryInterface } from 'src/domain/repositories/samples.interface';

@Injectable()
export class DeleteSampleUseCase {
  constructor(private readonly samplesRepository: SamplesRepositoryInterface) {}

  async execute(id: number): Promise<boolean> {
    if (!(await this.samplesRepository.findOne(id)))
      throw new NotFoundException();

    return await this.samplesRepository.delete(id);
  }
}
