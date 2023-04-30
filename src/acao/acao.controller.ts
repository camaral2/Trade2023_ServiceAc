import { Controller } from '@nestjs/common';
import { AcaoService } from './acao.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { acaoTodayDto } from './dto/acaoToday.dto';
import { AcaoDto } from './dto/acao.dto';

@Controller()
export class AcaoController {
  constructor(private readonly acaoService: AcaoService) {}

  @MessagePattern('get_acao_today')
  async getAcaoToday(@Payload() payload: acaoTodayDto): Promise<AcaoDto> {
    const acaoToday = await this.acaoService.getAcaoToday(payload.acao);
    return acaoToday;
  }
}
