import { Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { LogProcessoService } from './../log-processo/log-processo.service';

@Module({
  providers: [TwitterService, LogProcessoService],
})
export class TwitterModule {}
