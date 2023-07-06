import { Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { LogProcessoService } from './../log-processo/log-processo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configAcao } from './../acao/entities/configAcao.entity';
import { historico } from './entities/historico.entity';
import { processo } from './../log-processo/entities/processo.entity';

@Module({
  //  controllers: [TwitterController],
  imports: [
    TypeOrmModule.forFeature([configAcao]),
    TypeOrmModule.forFeature([historico]),
    TypeOrmModule.forFeature([processo]),
  ],
  providers: [TwitterService, LogProcessoService],
  exports: [TwitterService],
})
export class TwitterModule {}
