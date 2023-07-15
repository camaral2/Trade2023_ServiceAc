import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getVersion(): any {
    return {
      app: 'Trade2023_ServiceAc',
      version: process.env.npm_package_version,
      author: 'Cristian dos Santos Amaral',
      email: 'cristian_amaral@hotmail.com',
    };
  }
}
