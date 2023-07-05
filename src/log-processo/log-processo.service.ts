import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { processo } from './entities/processo.entity';
import { configAcao } from '../acao/entities/configAcao.entity';
import { typeKey } from './enum/typeKey.enum';
import { typeStatus } from './enum/typeStatus.enum';

@Injectable()
export class LogProcessoService {
  typeKey: any;
  typeStatus: any;
  constructor(
    @InjectRepository(processo)
    private readonly processoRepository: Repository<processo>,
    @InjectRepository(configAcao)
    private readonly configAcaoRepository: Repository<configAcao>,
  ) {}

  async newSession(): Promise<string> {
    return Math.random().toString(26).slice(2);
  }

  async createProcesso(pSessao: string, pAcao: string): Promise<any> {
    try {
      const processoData: processo[] = [
        new processo({
          sessao: pSessao,
          acao: pAcao,
          key: typeKey.kInicio,
          descricao: 'Processando Requisição',
          status: typeStatus.sPendente,
        }),
        new processo({
          sessao: pSessao,
          acao: pAcao,
          key: typeKey.kTwitter,
          descricao: 'Captura Twitter',
          status: typeStatus.sPendente,
        }),
        new processo({
          sessao: pSessao,
          acao: pAcao,
          key: typeKey.kAcoes,
          descricao: 'Captura Ações',
          status: typeStatus.sPendente,
        }),
        new processo({
          sessao: pSessao,
          acao: pAcao,
          key: typeKey.kCentraliza,
          descricao: 'Centraliza as Informações',
          status: typeStatus.sPendente,
        }),
        new processo({
          sessao: pSessao,
          acao: pAcao,
          key: typeKey.kPrognostico,
          descricao: 'Gera Prognóstico',
          status: typeStatus.sPendente,
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
  ): Promise<any> {
    const updateFields: any = {
      status: pStatus,
    };

    if (pErro) {
      updateFields.error = pErro;
    }

    if (pStatus === typeStatus.sExecucao) {
      updateFields.dtInicio = new Date();
    }

    if (pStatus === typeStatus.sConcluido || pStatus === typeStatus.sError) {
      updateFields.dtFim = new Date();
    }

    const result = await this.processoRepository.update(
      { sessao: pSessao, key: pKey },
      updateFields,
    );

    return result;
  }

  async consultaProcesso(pSessao: string): Promise<any[]> {
    const result = await this.processoRepository.find({
      where: { sessao: pSessao },
    });
    return result;
  }

  async expurgoProcesso(): Promise<any> {
    const result = await this.processoRepository.delete({});
    return result;
  }
}
