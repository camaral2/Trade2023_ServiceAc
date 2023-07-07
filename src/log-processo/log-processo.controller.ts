import {
  Controller,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LogProcessoService } from './log-processo.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ValidationExceptionFilter } from './../services/filter/validation-exception.filter';
import { CreateProcessoDto } from './dto/createProcesso.dto';

@Controller()
@UseFilters(ValidationExceptionFilter)
@UsePipes(ValidationPipe)
export class LogProcessoController {
  constructor(private readonly logProcessoService: LogProcessoService) {}

  @MessagePattern('newSession')
  async newSession(): Promise<string> {
    return await this.logProcessoService.newSession();
  }

  @MessagePattern('createProcesso')
  async createProcesso(@Payload() payload: CreateProcessoDto): Promise<string> {
    return await this.logProcessoService.createProcesso(
      payload.sessao,
      payload.acao,
    );
  }
}
