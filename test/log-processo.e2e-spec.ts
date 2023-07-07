import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateProcessoDto } from './../src/log-processo/dto/createProcesso.dto';
import { logProcessoTypeKey } from './../src/log-processo/enum/typeKey.enum';
import { UpdateProcessoDto } from './../src/log-processo/dto/updateProcesso.dto';
import { logProcessoTypeStatus } from './../src/log-processo/enum/typeStatus.enum';
import { IUpdateDeleteProcessoResponse } from './../src/log-processo/interfaces/update-deleteProcessoResponse.interface';
import { SelectProcessoDto } from './../src/log-processo/dto/selectProcesso.dto';

describe('LogProcesso Controller (e2e)', () => {
  let app: INestApplication;
  let client: ClientProxy;

  let session = '';
  let resultConsulta;
  const acao = 'MGLU3';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          { name: 'clientProcess', transport: Transport.TCP },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice({ Transport: Transport.TCP });

    await app.startAllMicroservices();
    await app.init();

    client = app.get('clientProcess');
    await client.connect();
  });

  afterAll(async () => {
    await app.close();
    await client.close();
  });

  describe('@expurgoProcesso', () => {
    it('should handle delete all', async () => {
      const res = await firstValueFrom(client.send('expurgoProcesso', ''));
      expect(res).toMatchObject<IUpdateDeleteProcessoResponse>({
        affected: expect.any(Number),
      });
    });
  });

  describe('@newSession', () => {
    it('should handle set new Session value', async () => {
      //const res = await client.send('newSession', '').toPromise();
      const res = await firstValueFrom(client.send('newSession', ''));
      expect(res).toBeDefined();
      expect(res).toMatch(/^[a-z0-9]{10,15}$/);

      session = res;
    });
  });

  describe('@createProcesso', () => {
    it('should create processo of session', async () => {
      const procCreate = new CreateProcessoDto();
      procCreate.sessao = session;
      procCreate.acao = acao;

      const result = await firstValueFrom(
        client.send('createProcesso', procCreate),
      );
      expect(result).toBeInstanceOf(Array);

      // Validate if the result is an array
      expect(result).toBeInstanceOf(Array);

      // Validate if the array length is 5
      expect(result.length).toBe(5);

      // Validate if all objects have the required attributes
      for (const obj of result) {
        expect(obj).toHaveProperty('sessao');
        expect(obj).toHaveProperty('acao');
        expect(obj).toHaveProperty('key');
        expect(obj).toHaveProperty('descricao');
        expect(obj).toHaveProperty('status');
      }

      // Validate if the key values 200, 300, 400 exist
      const keyValues = result.map((obj) => obj.key);
      expect(keyValues).toContain(logProcessoTypeKey.kInicio);
      expect(keyValues).toContain(logProcessoTypeKey.kTwitter);
      expect(keyValues).toContain(logProcessoTypeKey.kAcoes);
      expect(keyValues).toContain(logProcessoTypeKey.kCentraliza);
      expect(keyValues).toContain(logProcessoTypeKey.kPrognostico);

      // Validate if acao is 'acao'
      const acaoValues = result.map((obj) => obj.acao);
      expect(acaoValues).toContain(acao);

      // Validate if sessao is 'session'
      const sessaoValues = result.map((obj) => obj.sessao);
      expect(sessaoValues).toContain(session);
    });
  });

  describe('@updateProcesso [Processando Requisição]', () => {
    it('should update start processo of session ', async () => {
      const procUpdate = new UpdateProcessoDto();
      procUpdate.sessao = session;
      procUpdate.acao = acao;
      procUpdate.key = logProcessoTypeKey.kInicio;
      procUpdate.status = logProcessoTypeStatus.sExecucao;

      const res = await firstValueFrom(
        client.send('updateProcesso', procUpdate),
      );
      expect(res).toBeDefined();
      expect(res.affected).toEqual(1);
    });
  });

  describe('@updateProcesso [Captura Twitter]', () => {
    it('should update start processo of session ', async () => {
      const procUpdate = new UpdateProcessoDto();
      procUpdate.sessao = session;
      procUpdate.acao = acao;
      procUpdate.key = logProcessoTypeKey.kTwitter;
      procUpdate.status = logProcessoTypeStatus.sExecucao;

      const res = await firstValueFrom(
        client.send('updateProcesso', procUpdate),
      );
      expect(res).toBeDefined();
      expect(res.affected).toEqual(1);
    });
    it('should update end processo of session ', async () => {
      const procUpdate = new UpdateProcessoDto();
      procUpdate.sessao = session;
      procUpdate.acao = acao;
      procUpdate.key = logProcessoTypeKey.kTwitter;
      procUpdate.status = logProcessoTypeStatus.sConcluido;

      const res = await firstValueFrom(
        client.send('updateProcesso', procUpdate),
      );
      expect(res).toBeDefined();
      expect(res.affected).toEqual(1);
    });
  });

  describe('@updateProcesso [Captura Ações]', () => {
    it('should update start processo of session ', async () => {
      const procUpdate = new UpdateProcessoDto();
      procUpdate.sessao = session;
      procUpdate.acao = acao;
      procUpdate.key = logProcessoTypeKey.kAcoes;
      procUpdate.status = logProcessoTypeStatus.sExecucao;

      const res = await firstValueFrom(
        client.send('updateProcesso', procUpdate),
      );
      expect(res).toBeDefined();
      expect(res.affected).toEqual(1);
    });
    it('should update end processo of session ', async () => {
      const procUpdate = new UpdateProcessoDto();
      procUpdate.sessao = session;
      procUpdate.acao = acao;
      procUpdate.key = logProcessoTypeKey.kAcoes;
      procUpdate.status = logProcessoTypeStatus.sError;
      procUpdate.error = 'The message was not valid';

      const res = await firstValueFrom(
        client.send('updateProcesso', procUpdate),
      );
      expect(res).toBeDefined();
      expect(res.affected).toEqual(1);
    });
  });

  describe('@consultaProcesso', () => {
    it('should list all processo of session', async () => {
      const procSelect = new SelectProcessoDto();
      procSelect.sessao = session;

      resultConsulta = await firstValueFrom(
        client.send('consultaProcesso', procSelect),
      );
      expect(resultConsulta).toBeInstanceOf(Array);

      // Validate if the result is an array
      expect(resultConsulta).toBeInstanceOf(Array);

      // Validate if the array length is 5
      expect(resultConsulta.length).toBe(5);

      // Validate if all objects have the required attributes
      for (const obj of resultConsulta) {
        expect(obj).toHaveProperty('sessao');
        expect(obj).toHaveProperty('acao');
        expect(obj).toHaveProperty('key');
        expect(obj).toHaveProperty('descricao');
        expect(obj).toHaveProperty('status');
      }

      const keyValues = resultConsulta.map((obj) => obj.key);
      expect(keyValues).toContain(logProcessoTypeKey.kInicio);
      expect(keyValues).toContain(logProcessoTypeKey.kTwitter);
      expect(keyValues).toContain(logProcessoTypeKey.kAcoes);
      expect(keyValues).toContain(logProcessoTypeKey.kCentraliza);
      expect(keyValues).toContain(logProcessoTypeKey.kPrognostico);

      // Validate if acao is 'acao'
      const acaoValues = resultConsulta.map((obj) => obj.acao);
      expect(acaoValues).toContain(acao);

      // Validate if sessao is 'session'
      const sessaoValues = resultConsulta.map((obj) => obj.sessao);
      expect(sessaoValues).toContain(session);
    });

    it('should satisfy the required conditions of Update Inicio', async () => {
      const record_Inicio = await resultConsulta.find(
        (record) => record.key === logProcessoTypeKey.kInicio,
      );
      expect(record_Inicio.status).toBe(logProcessoTypeStatus.sExecucao);
      expect(record_Inicio.dtInicio).toBeDefined();
      expect(new Date(record_Inicio.dtInicio)).toBeInstanceOf(Date);

      expect(record_Inicio.dtFim).not.toBeDefined();
      expect(record_Inicio.error).not.toBeDefined();
    });

    it('should satisfy the required conditions of Update Twitter', async () => {
      const record_Twitter = await resultConsulta.find(
        (record) => record.key === logProcessoTypeKey.kTwitter,
      );
      expect(record_Twitter.status).toBe(logProcessoTypeStatus.sConcluido);
      expect(record_Twitter.dtInicio).toBeDefined();
      expect(new Date(record_Twitter.dtInicio)).toBeInstanceOf(Date);

      expect(record_Twitter.dtFim).toBeDefined();
      expect(new Date(record_Twitter.dtFim)).toBeInstanceOf(Date);

      expect(record_Twitter.error).not.toBeDefined();
    });

    it('should satisfy the required conditions of Update Acoes', async () => {
      const record_Acao = await resultConsulta.find(
        (record) => record.key === logProcessoTypeKey.kAcoes,
      );
      expect(record_Acao.status).toBe(logProcessoTypeStatus.sError);
      expect(record_Acao.dtInicio).toBeDefined();
      expect(new Date(record_Acao.dtInicio)).toBeInstanceOf(Date);

      expect(record_Acao.dtFim).toBeDefined();
      expect(new Date(record_Acao.dtFim)).toBeInstanceOf(Date);

      expect(record_Acao.error).toBeDefined();
      expect(record_Acao.error).toBe('The message was not valid');
    });

    it('should satisfy the required conditions of Update Centraliza', async () => {
      const record_Centraliza = await resultConsulta.find(
        (record) => record.key === logProcessoTypeKey.kCentraliza,
      );
      expect(record_Centraliza.status).toBe(logProcessoTypeStatus.sPendente);
      expect(record_Centraliza.dtInicio).not.toBeDefined();
      expect(record_Centraliza.dtFim).not.toBeDefined();
      expect(record_Centraliza.error).not.toBeDefined();
    });
  });
});
