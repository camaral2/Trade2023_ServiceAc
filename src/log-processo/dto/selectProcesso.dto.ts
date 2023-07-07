import { IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class SelectProcessoDto {
  @IsString()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  sessao: string;
}
