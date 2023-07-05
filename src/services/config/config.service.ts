import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    dotenv.config();

    this.envConfig = {
      port: process.env.ACAO_SERVICE_PORT,
    };
    this.envConfig.MONGO_URL = process.env.MONGO_URL;
    this.envConfig.BEARER_TOKEN = process.env.BEARER_TOKEN;
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
