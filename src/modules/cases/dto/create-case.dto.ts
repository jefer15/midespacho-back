import { IsString, IsOptional } from 'class-validator';

export class CreateCaseDto {
  @IsString()
  caseNumber: string;

  @IsString()
  clientName: string;

  @IsString()
  attorney: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  court?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  openingDate?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;
}