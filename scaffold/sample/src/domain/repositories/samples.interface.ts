import { Sample } from 'src/domain/models/sample';
import { GenericRepositoryInterface } from './generic.interface';

export abstract class SamplesRepositoryInterface extends GenericRepositoryInterface<Sample> {}
