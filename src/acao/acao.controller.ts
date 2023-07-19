import { Controller } from '@nestjs/common';
import { AcaoService } from './acao.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { acaoTodayDto } from './dto/acaoToday.dto';
import { AcaoDto } from './dto/acao.dto';
import logger from '../utils/logger';
import { configAcao } from './entities/configAcao.entity';

@Controller()
export class AcaoController {
  constructor(private readonly acaoService: AcaoService) {}

  @MessagePattern('get_acao_today')
  async getAcaoToday(@Payload() payload: acaoTodayDto): Promise<AcaoDto> {
    logger.log('Get get_acao_today: ' + payload.acao);
    const acaoToday = await this.acaoService.getAcaoToday(payload.acao);
    return acaoToday;
  }

  @MessagePattern('get_acao_all')
  async getAcaoAll(): Promise<configAcao[]> {
    const acoes = await this.acaoService.getAll();
    return acoes;
  }
}
