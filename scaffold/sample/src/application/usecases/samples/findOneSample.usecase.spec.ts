import { makeSample } from 'test/factories/sample.factory';
import { SamplesInMemoryRepository } from 'test/repositories/samples.database';
import { FindOneSampleUseCase } from './findOneSample.usecase';

describe('FindOneSampleUseCase', () => {
  let inMemoryRepository: SamplesInMemoryRepository;
  let useCase: FindOneSampleUseCase;

  beforeAll(async () => {
    inMemoryRepository = new SamplesInMemoryRepository();
    useCase = new FindOneSampleUseCase(inMemoryRepository);
  });

  it('should find one Sample', async () => {
    for (let i = 0; i < 5; i++)
      await inMemoryRepository.create(
        makeSample({ id: i + 1, deletedAt: null }),
      );

    expect(await useCase.execute(1)).not.toBeNull();
    expect(await useCase.execute(5)).not.toBeNull();
    await expect(useCase.execute(10)).rejects.toThrow();
  });
});
