import { makeSample } from 'test/factories/sample.factory';
import { SamplesInMemoryRepository } from 'test/repositories/samples.database';
import { CreateSampleUseCase } from './createSample.usecase';

describe('CreateSampleUseCase', () => {
  let inMemoryRepository: SamplesInMemoryRepository;
  let useCase: CreateSampleUseCase;

  beforeAll(async () => {
    inMemoryRepository = new SamplesInMemoryRepository();
    useCase = new CreateSampleUseCase(inMemoryRepository);
  });

  it('should create a Sample', async () => {
    const item = await useCase.execute(makeSample({ deletedAt: null }));
    expect(item).not.toBeNull();
  });
});
