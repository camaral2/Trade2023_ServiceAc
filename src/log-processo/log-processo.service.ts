import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { processo } from './entities/processo.entity';
import { configAcao } from '../acao/entities/configAcao.entity';
import { logProcessoTypeKey } from './enum/typeKey.enum';
import { logProcessoTypeStatus } from './enum/typeStatus.enum';
import { IUpdateDeleteProcessoResponse } from './interfaces/update-deleteProcessoResponse.interface';

@Injectable()
export class LogProcessoService {
  constructor(
    @InjectRepository(processo)
    private readonly processoRepository: Repository<processo>,
    @InjectRepository(configAcao)
    private readonly configAcaoRepository: Repository<configAcao>,
  ) {}

  async newSession(): Promise<string> {
    return Math.random().toString(26).slice(2);
  }

  async createProcesso(pSessao: string, pAcao: string): Promise<processo[]> {
    try {
      const processoData: processo[] = [
        new processo({
          sessao: pSessao,
          acao: pAcao,
          key: logProcessoTypeKey.kInicio,
          descricao: 'Processando Requisição',
          status: logProcessoTypeStatus.sPendente,
        }),
        new processo({
          sessao: pSessao,
          acao: pAcao,
          key: logProcessoTypeKey.kTwitter,
          descricao: 'Captura Twitter',
          status: logProcessoTypeStatus.sPendente,
        }),
        new processo({
          sessao: pSessao,
          acao: pAcao,
          key: logProcessoTypeKey.kAcoes,
          descricao: 'Captura Ações',
          status: logProcessoTypeStatus.sPendente,
        }),
        new processo({
          sessao: pSessao,
          acao: pAcao,
          key: logProcessoTypeKey.kCentraliza,
          descricao: 'Centraliza as Informações',
          status: logProcessoTypeStatus.sPendente,
        }),
        new processo({
          sessao: pSessao,
          acao: pAcao,
          key: logProcessoTypeKey.kPrognostico,
          descricao: 'Gera Prognóstico',
          status: logProcessoTypeStatus.sPendente,
        }),
      ];

      const processos = await this.processoRepository.save(processoData);

      await this.configAcaoRepository.update(
        { acao: pAcao },
        { sessao: pSessao, data: new Date() },
      );

      return processos;
    } catch (error) {
      throw error;
    }
  }

  async updateProcesso(
    pSessao: string,
    pKey: number,
    pStatus: number,
    pErro?: any,
  ): Promise<IUpdateDeleteProcessoResponse> {
    const updateFields: any = {
      status: pStatus,
    };

    if (pErro) {
      updateFields.error = pErro;
    }

    if (pStatus === logProcessoTypeStatus.sExecucao) {
      updateFields.dtInicio = new Date();
    }

    if (
      pStatus === logProcessoTypeStatus.sConcluido ||
      pStatus === logProcessoTypeStatus.sError
    ) {
      updateFields.dtFim = new Date();
    }

    const result = await this.processoRepository.update(
      { sessao: pSessao, key: pKey },
      updateFields,
    );

    return result;
  }

  async consultaProcesso(pSessao: string): Promise<processo[]> {
    const result = await this.processoRepository.find({
      where: { sessao: pSessao },
    });
    return result;
  }

  async expurgoProcesso(): Promise<IUpdateDeleteProcessoResponse> {
    const result = await this.processoRepository.delete({});
    return result;
  }
}
