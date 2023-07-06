import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

describe('LogProcesso Controller (e2e)', () => {
  let app: INestApplication;
  let client: ClientProxy;

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
      expect(res).toMatch(/[a-z0-9]{12}/);
    });
  });
});
