import { makeSampleList } from 'test/factories/sample.factory';
import { SamplesInMemoryRepository } from 'test/repositories/samples.database';
import { FindAllSamplesUseCase } from './findAllSamples.usecase';

describe('FindAllSamplesUseCase', () => {
  let inMemoryRepository: SamplesInMemoryRepository;
  let useCase: FindAllSamplesUseCase;

  beforeAll(async () => {
    inMemoryRepository = new SamplesInMemoryRepository();
    useCase = new FindAllSamplesUseCase(inMemoryRepository);
  });

  it('should find all Samples', async () => {
    for (const sample of makeSampleList(5, { deletedAt: null }))
      await inMemoryRepository.create(sample);

    expect((await useCase.execute()).data).toHaveLength(5);
  });
});
