import { Test, TestingModule } from '@nestjs/testing';
import { AcaoController } from './acao.controller';
import { AcaoService } from './acao.service';
import { RequestUtils } from '../utils';
import { configAcao } from './entities/configAcao.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AcaoDto } from './dto/acao.dto';

describe('AcaoController', () => {
  let acaoController: AcaoController;
  let acaoService: AcaoService;

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

    acaoService = app.get<AcaoService>(AcaoService);
    acaoController = app.get<AcaoController>(AcaoController);
  });

  it('should be defined', () => {
    expect(acaoController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result: AcaoDto = {
        acao: 'MGLU3',
        value: 2.13,
        valueMin: 1.67,
        valueMax: 3.29,
        dataAcao: new Date(2023, 4, 3),
      };

      jest.spyOn(acaoService, 'getAcaoToday').mockResolvedValue(result);

      expect(await acaoController.getAcaoToday({ acao: result.acao })).toBe(
        result,
      );
    });
  });
});
