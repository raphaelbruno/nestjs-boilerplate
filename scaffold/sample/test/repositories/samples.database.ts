import { Sample } from 'src/domain/models/sample';
import { SamplesRepositoryInterface } from 'src/domain/repositories/samples.interface';
import { GenericInMemoryRepository } from './generic.database';

export class SamplesInMemoryRepository
  extends GenericInMemoryRepository<Sample>
  implements SamplesRepositoryInterface {}
