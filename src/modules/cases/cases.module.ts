import { Module } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CasesController } from './cases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Case } from './entities/case.entity';
import { FileBatch } from './entities/file-batch.entity';
import { CaseFile } from './entities/case-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Case, FileBatch, CaseFile])],
  controllers: [CasesController],
  providers: [CasesService],
})
export class CasesModule {}
