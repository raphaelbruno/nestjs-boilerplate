import { Injectable } from '@nestjs/common';
import { NotFoundException } from 'src/application/exceptions/notFound.exception';
import { Sample } from 'src/domain/models/sample';
import { SamplesRepositoryInterface } from 'src/domain/repositories/samples.interface';

@Injectable()
export class FindOneSampleUseCase {
  constructor(private readonly samplesRepository: SamplesRepositoryInterface) {}

  async execute(id: number): Promise<Sample | null> {
    const item = await this.samplesRepository.findOne(id);

    if (!item) throw new NotFoundException();

    return item;
  }
}
