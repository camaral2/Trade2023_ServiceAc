import { Test, TestingModule } from '@nestjs/testing';
import { AcaoController } from './acao.controller';
import { AcaoService } from './acao.service';
import { RequestUtils } from '../utils';
import { configAcao } from './entities/configAcao.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AcaoController', () => {
  let acaoController: AcaoController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AcaoController],
      providers: [
        RequestUtils,
        AcaoService,
        {
          provide: getRepositoryToken(configAcao),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    acaoController = app.get<AcaoController>(AcaoController);
  });

  it('should be defined', () => {
    expect(acaoController).toBeDefined();
  });
});
