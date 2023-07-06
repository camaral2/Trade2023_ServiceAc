import { Test, TestingModule } from '@nestjs/testing';
import { LogProcessoController } from './log-processo.controller';

describe('LogProcessoController', () => {
  let controller: LogProcessoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogProcessoController],
    }).compile();

    controller = module.get<LogProcessoController>(LogProcessoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
