import { Test, TestingModule } from '@nestjs/testing';
import { TwitterController } from './twitter.controller';
import { TwitterService } from './twitter.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { historico } from './entities/historico.entity';

describe('TwitterController', () => {
  let controller: TwitterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwitterController],
      providers: [
        TwitterService,
        {
          provide: getRepositoryToken(historico),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TwitterController>(TwitterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
