import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcaoModule } from './acao/acao.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Import the ConfigModule
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import the ConfigModule here as well
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get('MONGO_URL'), // Use the configuration key here
        entities: [join(__dirname, '**/**.entity{.ts,.js}')],
        synchronize: true,
        useNewUrlParser: true,
        logging: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService], // Inject the ConfigService
    }),
    AcaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
