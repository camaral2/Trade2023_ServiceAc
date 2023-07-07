import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { logProcessoTypeKey } from '../enum/typeKey.enum';
import { logProcessoTypeStatus } from '../enum/typeStatus.enum';

export class UpdateProcessoDto {
  @IsString()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  sessao: string;

  @IsString()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  acao: string;

  @IsEnum(logProcessoTypeKey)
  @IsNotEmpty()
  key: logProcessoTypeKey;

  @IsEnum(logProcessoTypeStatus)
  @IsNotEmpty()
  status: logProcessoTypeStatus;

  @IsOptional()
  @IsString()
  error?: string;
}
