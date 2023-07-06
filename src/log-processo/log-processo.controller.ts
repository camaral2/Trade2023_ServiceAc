import {
  Controller,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LogProcessoService } from './log-processo.service';
import { MessagePattern } from '@nestjs/microservices';
import { ValidationExceptionFilter } from './../services/filter/validation-exception.filter';

@Controller()
export class LogProcessoController {
  constructor(private readonly logProcessoService: LogProcessoService) {}

  @MessagePattern('newSession')
  @UseFilters(ValidationExceptionFilter)
  @UsePipes(ValidationPipe)
  async newSession(): Promise<string> {
    return await this.logProcessoService.newSession();
  }
}
