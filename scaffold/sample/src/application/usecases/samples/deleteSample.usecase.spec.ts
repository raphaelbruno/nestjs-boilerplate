import { makeSample } from 'test/factories/sample.factory';
import { SamplesInMemoryRepository } from 'test/repositories/samples.database';
import { DeleteSampleUseCase } from './deleteSample.usecase';

describe('DeleteSampleUseCase', () => {
  let inMemoryRepository: SamplesInMemoryRepository;
  let useCase: DeleteSampleUseCase;

  beforeAll(async () => {
    inMemoryRepository = new SamplesInMemoryRepository();
    useCase = new DeleteSampleUseCase(inMemoryRepository);
  });

  it('should delete a Sample', async () => {
    const item = makeSample({ deletedAt: null });
    await inMemoryRepository.create(item);

    expect(await useCase.execute(item.id)).toBe(true);
    expect((await inMemoryRepository.findAll()).data).toHaveLength(0);
  });
});
