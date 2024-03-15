import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateSampleUseCase } from 'src/application/usecases/samples/createSample.usecase';
import { DeleteSampleUseCase } from 'src/application/usecases/samples/deleteSample.usecase';
import { FindAllSamplesUseCase } from 'src/application/usecases/samples/findAllSamples.usecase';
import { FindOneSampleUseCase } from 'src/application/usecases/samples/findOneSample.usecase';
import { UpdateSampleUseCase } from 'src/application/usecases/samples/updateSample.usecase';
import { SamplesRepositoryInterface } from 'src/domain/repositories/samples.interface';
import { makeSample } from 'test/factories/sample.factory';
import { SamplesInMemoryRepository } from 'test/repositories/samples.database';
import { PaginatedResponse } from '../schemas/paginated.schema';
import { SampleResponse } from '../schemas/sample.schema';
import { SamplesController } from './samples.controller';

describe('SamplesController', () => {
  let controller: SamplesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SamplesController],
      providers: [
        FindAllSamplesUseCase,
        FindOneSampleUseCase,
        CreateSampleUseCase,
        UpdateSampleUseCase,
        DeleteSampleUseCase,
        {
          provide: SamplesRepositoryInterface,
          useClass: SamplesInMemoryRepository,
        },
      ],
    }).compile();

    controller = app.get<SamplesController>(SamplesController);
  });

  describe('root', () => {
    it('should return paginated samples from findAll function', async () => {
      const listAll = await controller.findAll();
      expect(listAll).toBeInstanceOf(PaginatedResponse<SampleResponse>);
    });

    it('should return a sample from findOne function', async () => {
      const item = makeSample({ deletedAt: null });
      await controller.create(item);
      const response = await controller.findOne(item.id);

      expect(response).toBeInstanceOf(SampleResponse);
      expect(response).not.toHaveProperty('updatedAt');
      expect(response).not.toHaveProperty('deletedAt');
      expect(response).toMatchObject({
        id: item.id,
        title: item.title,
      });
      await expect(controller.findOne(0)).rejects.toThrow(HttpException);
    });

    it('should create a sample from create function', async () => {
      const item = makeSample({ deletedAt: null });
      const response = await controller.create(item);

      expect(response).toBeInstanceOf(SampleResponse);
      expect(response).not.toHaveProperty('updatedAt');
      expect(response).not.toHaveProperty('deletedAt');
      expect(response).toMatchObject({
        id: item.id,
        title: item.title,
      });
    });

    it('should update a sample from update function', async () => {
      const item = makeSample({ deletedAt: null });
      await controller.create(item);
      const response = await controller.update(item.id, item);

      expect(response).toBeInstanceOf(SampleResponse);
      expect(response).not.toHaveProperty('updatedAt');
      expect(response).not.toHaveProperty('deletedAt');
      expect(response).toMatchObject({
        id: item.id,
        title: item.title,
      });
    });

    it('should delete a sample from delete function', async () => {
      const item = makeSample({ deletedAt: null });
      await controller.create(item);

      expect(await controller.delete(item.id)).toBeNull();
      await expect(controller.delete(0)).rejects.toThrow(HttpException);
    });
  });
});
