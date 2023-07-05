import { Module } from '@nestjs/common';
import { LogProcessoService } from './log-processo.service';

@Module({
  providers: [LogProcessoService]
})
export class LogProcessoModule {}
