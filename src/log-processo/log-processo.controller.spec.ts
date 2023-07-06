import { Test, TestingModule } from '@nestjs/testing';
import { LogProcessoController } from './log-processo.controller';
import { LogProcessoService } from './log-processo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { processo } from './entities/processo.entity';
import { configAcao } from './../acao/entities/configAcao.entity';

describe('LogProcessoController', () => {
  let controller: LogProcessoController;
  //let service: LogProcessoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogProcessoController],
      providers: [
        LogProcessoService,
        {
          provide: getRepositoryToken(configAcao),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(processo),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LogProcessoController>(LogProcessoController);
    //service = module.get<LogProcessoService>(LogProcessoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
