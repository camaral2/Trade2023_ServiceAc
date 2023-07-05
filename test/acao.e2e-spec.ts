import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should handle get_acao_today message', async () => {
    const payload = { acao: 'example' }; // Provide appropriate payload

    const response = await request(app.getHttpServer())
      .post('/your-microservice-endpoint') // Replace with your microservice endpoint
      .send({
        pattern: 'get_acao_today',
        data: payload,
      })
      .expect(200);

    // Add your assertions for the response
    expect(response.body).toBeDefined();
  });
});
