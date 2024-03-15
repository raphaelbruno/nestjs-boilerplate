import { Injectable } from '@nestjs/common';
import { Sample } from 'src/domain/models/sample';
import { SamplesRepositoryInterface } from 'src/domain/repositories/samples.interface';
import { GenericRepository } from './generic.repository';

@Injectable()
export class SamplesRepository
  extends GenericRepository<Sample>
  implements SamplesRepositoryInterface
{
  protected table: string = 'samples';
  protected searchFields: string[] = ['title'];
  protected relationship: object = {
    include: {
      user: true,
    },
  };
}
