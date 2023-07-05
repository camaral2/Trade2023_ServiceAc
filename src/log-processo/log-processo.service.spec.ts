import { Test, TestingModule } from '@nestjs/testing';
import { LogProcessoService } from './log-processo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { processo } from './entities/processo.entity';
import { configAcao } from './../acao/entities/configAcao.entity';

describe('LogProcessoService', () => {
  let service: LogProcessoService;
  //let configAcaoRepository: Repository<configAcao>;
  //let processoRepository: Repository<processo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<LogProcessoService>(LogProcessoService);
    // configAcaoRepository = module.get<Repository<configAcao>>(
    //   getRepositoryToken(configAcao),
    // );
    // processoRepository = module.get<Repository<processo>>(
    //   getRepositoryToken(processo),
    // );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
