import { Sample } from 'src/domain/models/sample';
import { makeSample } from 'test/factories/sample.factory';
import { SamplesInMemoryRepository } from 'test/repositories/samples.database';
import { UpdateSampleUseCase } from './updateSample.usecase';

describe('UpdateSampleUseCase', () => {
  let inMemoryRepository: SamplesInMemoryRepository;
  let useCase: UpdateSampleUseCase;

  beforeAll(async () => {
    inMemoryRepository = new SamplesInMemoryRepository();
    useCase = new UpdateSampleUseCase(inMemoryRepository);
  });

  it('should update a Sample', async () => {
    const item = await inMemoryRepository.create(
      makeSample({ deletedAt: null }),
    );
    const editedItem = await useCase.execute(
      new Sample({ ...item, title: 'Edited Title', userId: 1 }),
    );

    expect(editedItem.title).toBe('Edited Title');
    expect(editedItem.userId).toBe(1);
  });
});
