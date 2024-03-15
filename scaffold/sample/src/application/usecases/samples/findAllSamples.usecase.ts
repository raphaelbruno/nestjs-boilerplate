import { Injectable } from '@nestjs/common';
import { Paginated } from 'src/domain/models/commons/paginated';
import { PaginatedQuery } from 'src/domain/models/commons/paginatedQuery';
import { Sample } from 'src/domain/models/sample';
import { SamplesRepositoryInterface } from 'src/domain/repositories/samples.interface';

@Injectable()
export class FindAllSamplesUseCase {
  constructor(private readonly samplesRepository: SamplesRepositoryInterface) {}

  async execute(params?: PaginatedQuery): Promise<Paginated<Sample>> {
    return await this.samplesRepository.findAll(params);
  }
}
