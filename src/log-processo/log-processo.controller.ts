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
import { UpdateProcessoDto } from './dto/updateProcesso.dto';
import { SelectProcessoDto } from './dto/selectProcesso.dto';
import { processo } from './entities/processo.entity';
import { IUpdateDeleteProcessoResponse } from './interfaces/update-deleteProcessoResponse.interface';

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
  async createProcesso(
    @Payload() payload: CreateProcessoDto,
  ): Promise<processo[]> {
    return await this.logProcessoService.createProcesso(
      payload.sessao,
      payload.acao,
    );
  }

  @MessagePattern('updateProcesso')
  async updateProcesso(
    @Payload() payload: UpdateProcessoDto,
  ): Promise<IUpdateDeleteProcessoResponse> {
    return await this.logProcessoService.updateProcesso(
      payload.sessao,
      payload.key,
      payload.status,
      payload.error,
    );
  }

  @MessagePattern('consultaProcesso')
  async consultaProcesso(
    @Payload() payload: SelectProcessoDto,
  ): Promise<processo[]> {
    return await this.logProcessoService.consultaProcesso(payload.sessao);
  }

  @MessagePattern('expurgoProcesso')
  async expurgoProcesso(): Promise<IUpdateDeleteProcessoResponse> {
    return await this.logProcessoService.expurgoProcesso();
  }
}
