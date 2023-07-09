import {
  Controller,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationExceptionFilter } from './../services/filter/validation-exception.filter';
import { TwitterService } from './twitter.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { acaoTwitterInterface } from './interface/acao.twitter.interface';

@Controller()
@UseFilters(ValidationExceptionFilter)
@UsePipes(ValidationPipe)
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @MessagePattern('getTwitter')
  async getTwitter(
    @Payload() payload: acaoTwitterInterface,
  ): Promise<acaoTwitterInterface> {
    return await this.twitterService.getTwitter(payload);
  }
}
