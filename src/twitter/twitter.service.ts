import needle from 'needle';
import ml from 'tradesentiment';
import { LogProcessoService } from './../log-processo/log-processo.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { historico } from './entities/historico.entity';
import { paramsTwitterInterface } from './interface/params.twitter.interface';
import logger from '../utils/logger';
import { ConfigService } from './../services/config/config.service';
import { logProcessoTypeKey } from './../log-processo/enum/typeKey.enum';
import { logProcessoTypeStatus } from './../log-processo/enum/typeStatus.enum';

@Injectable()
export class TwitterService {
  private readonly USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36';
  private readonly token = new ConfigService().get('BEARER_TOKEN');
  private readonly endpointUrl = `https://api.twitter.com/2/tweets/search/recent?`;
  private readonly url = new ConfigService().get('MONGO_URL');

  constructor(
    @InjectRepository(historico)
    private readonly historicoAcaoRepository: Repository<historico>,
    private logProc: LogProcessoService,
  ) {}

  async getTwitter(par: any): Promise<any> {
    try {
      await this.logProc.updateProcesso(
        par.sessao,
        logProcessoTypeKey.kTwitter,
        logProcessoTypeStatus.sExecucao,
      );

      let dtInicial = null;
      const ultimoHistorico = await this.getUltimaData(par.nomeAcao);

      if (ultimoHistorico != null) dtInicial = ultimoHistorico.created_at;

      await this.getRequest(par.nomeAcao, null, dtInicial);

      const d = {
        Acao: par.nomeAcao,
      };

      await this.logProc.updateProcesso(
        par.sessao,
        logProcessoTypeKey.kTwitter,
        logProcessoTypeStatus.sConcluido,
      );
      return d;
    } catch (error) {
      await this.logProc.updateProcesso(
        par.sessao,
        logProcessoTypeKey.kTwitter,
        logProcessoTypeStatus.sError,
        error,
      );
      throw error;
    }
  }

  private async getUltimaData(acao: string): Promise<historico | null> {
    return await this.historicoAcaoRepository.findOne({
      where: { acao },
      order: { dtbrasil: 'DESC' },
    });
  }

  private preparaData(data: string): string | null {
    const ud = new Date(data);
    const udLimite = new Date();

    udLimite.setDate(udLimite.getDate() - 7);

    if (ud < udLimite) return null;
    else {
      ud.setSeconds(ud.getSeconds() + 1);
      return ud.toISOString();
    }
  }

  private async getRequest(
    acao: string,
    page: string | null,
    dataInicial: string | null,
  ): Promise<void> {
    const params: paramsTwitterInterface = {
      query: acao, // Replace the value with your search term
      'tweet.fields': 'text,created_at',
      max_results: 100, //
    };

    if (dataInicial) {
      params.start_time = dataInicial;
    }

    if (page) params.next_token = page;

    const res = await needle('get', this.endpointUrl, params, {
      headers: {
        authorization: `Bearer ${this.token}`,
      },
    });

    if (res.body) {
      if (!res.body.data && !res.body.meta) {
        logger.log(res.body);
        throw new Error('Falha ao executar:' + JSON.stringify(res.body));
      }

      if (res.body.meta) {
        logger.log('Acao:', acao);
        logger.log('Qtd:', res.body.meta.result_count);
        logger.log('Page:', res.body.meta.next_token);
      }

      if (res.body.data) {
        await this.salvaDados(acao, res.body);

        if (res.body.meta.next_token) {
          await this.getRequest(acao, res.body.meta.next_token, dataInicial);
        }
      }
    } else {
      throw new Error('Unsuccessful request');
    }
  }

  private async salvaDados(acao: string, dados: any): Promise<void> {
    for (const item of dados.data) {
      const dt = new Date(item.created_at);
      dt.setHours(dt.getHours() - 3);

      item.acao = acao;
      item.dtbrasil = dt;
      item.sentiment = ml.classify(item.text || '');

      try {
        await this.historicoAcaoRepository.save(item);
      } catch (error) {
        logger.error(error);
      }
    }
  }
}
