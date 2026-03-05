import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case } from './entities/case.entity';
import { FileBatch } from './entities/file-batch.entity';
import { CaseFile } from './entities/case-file.entity';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { UploadBatchDto } from './dto/upload-batch.dto';

@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Case) private caseRepo: Repository<Case>,
    @InjectRepository(FileBatch) private batchRepo: Repository<FileBatch>,
    @InjectRepository(CaseFile) private fileRepo: Repository<CaseFile>,
  ) { }

  findAll(): Promise<Case[]> {
    return this.caseRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Case> {
    const record = await this.caseRepo.findOne({
      where: { id },
      relations: ['batches', 'batches.files'],
      order: { batches: { createdAt: 'DESC' } },
    });
    if (!record) throw new NotFoundException(`Case #${id} not found`);
    return record;
  }

  create(dto: CreateCaseDto): Promise<Case> {
    return this.caseRepo.save(this.caseRepo.create(dto));
  }

  async update(id: number, dto: UpdateCaseDto): Promise<Case> {
    await this.caseRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.caseRepo.delete(id);
  }

  async uploadBatch(
    caseId: number,
    files: Express.Multer.File[],
    dto: UploadBatchDto,
  ): Promise<FileBatch> {

    const caseRecord = await this.findOne(caseId);

    const batchCount = await this.batchRepo.count({
      where: { case: { id: caseId } },
    });

    const batchIndex = batchCount + 1;

    const folderPath = `cases/${caseRecord.caseNumber}/batch-${batchIndex}`;

    const batch = await this.batchRepo.save(
      this.batchRepo.create({
        title: dto.title,
        description: dto.description,
        folderPath,
        case: caseRecord,
      }),
    );

    const fileEntities = files.map((f) =>
      this.fileRepo.create({
        originalName: f.originalname,
        storedName: f.filename,
        relativePath: `${folderPath}/${f.filename}`,
        mimetype: f.mimetype,
        size: f.size,
        batch,
      }),
    );

    batch.files = await this.fileRepo.save(fileEntities);

    return batch;
  }

  async deleteBatch(id: number): Promise<void> {
    await this.batchRepo.delete(id);
  }

  async deleteFile(id: number): Promise<void> {
    await this.fileRepo.delete(id);
  }
}