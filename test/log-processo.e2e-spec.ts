import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateProcessoDto } from './../src/log-processo/dto/createProcesso.dto';
import { logProcessoTypeKey } from './../src/log-processo/enum/typeKey.enum';

describe('LogProcesso Controller (e2e)', () => {
  let app: INestApplication;
  let client: ClientProxy;

  let session = '';
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

  describe('@newSession', () => {
    it('should handle get new Session value', async () => {
      //const res = await client.send('newSession', '').toPromise();
      const res = await firstValueFrom(client.send('newSession', ''));
      expect(res).toBeDefined();
      expect(res).toMatch(/^[a-z0-9]{10,12}$/);

      session = res;
    });
  });

  describe('@createProcesso', () => {
    it('should create processo', async () => {
      //const res = await client.send('newSession', '').toPromise();
      const proc = new CreateProcessoDto();
      proc.sessao = session;
      proc.acao = acao;

      const result = await firstValueFrom(client.send('createProcesso', proc));
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
});
