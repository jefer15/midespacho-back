import { IsString, IsOptional } from 'class-validator';

export class UploadBatchDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}