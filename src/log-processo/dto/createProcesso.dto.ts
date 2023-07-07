import { IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProcessoDto {
  @IsString()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  sessao: string;

  @IsString()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  acao: string;
}
