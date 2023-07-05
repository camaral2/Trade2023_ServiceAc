import { Test, TestingModule } from '@nestjs/testing';
import { TwitterService } from './twitter.service';
import { configAcao } from './../acao/entities/configAcao.entity';
import { processo } from './..//log-processo/entities/processo.entity';
import { historico } from './entities/historico.entity';
import { LogProcessoService } from './../log-processo/log-processo.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TwitterService', () => {
  let service: TwitterService;
  // let logProc: LogProcessoService;
  // let configAcaoRepository: Repository<configAcao>;
  // let processoRepository: Repository<processo>;
  // let historicoRepository: Repository<historico>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogProcessoService,
        TwitterService,
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
        {
          provide: getRepositoryToken(historico),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TwitterService>(TwitterService);
    // logProc = module.get<LogProcessoService>(LogProcessoService);
    // configAcaoRepository = module.get<Repository<configAcao>>(
    //   getRepositoryToken(configAcao),
    // );
    // processoRepository = module.get<Repository<processo>>(
    //   getRepositoryToken(processo),
    // );
    // historicoRepository = module.get<Repository<historico>>(
    //   getRepositoryToken(historico),
    // );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
