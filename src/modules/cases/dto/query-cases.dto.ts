import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryCasesDto {

  @IsOptional()
  @Type(() => Number)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  pageSize = 10;

  @IsOptional()
  search?: string;
}