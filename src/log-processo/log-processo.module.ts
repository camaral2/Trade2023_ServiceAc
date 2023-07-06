import { Module } from '@nestjs/common';
import { LogProcessoService } from './log-processo.service';
import { LogProcessoController } from './log-processo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { processo } from './entities/processo.entity';
import { configAcao } from './../acao/entities/configAcao.entity';

@Module({
  controllers: [LogProcessoController],
  imports: [
    TypeOrmModule.forFeature([processo]),
    TypeOrmModule.forFeature([configAcao]),
  ],
  providers: [LogProcessoService],
  exports: [LogProcessoService],
})
export class LogProcessoModule {}
