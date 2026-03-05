import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, ParseIntPipe,
  UseInterceptors, UploadedFiles,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { UploadBatchDto } from './dto/upload-batch.dto';
import { memoryStorage } from 'multer';
import { QueryCasesDto } from './dto/query-cases.dto';

@Controller('cases')
export class CasesController {
  constructor(private readonly service: CasesService) { }

  @Get()
  findAll(@Query() query: QueryCasesDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCaseDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCaseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post(':id/batches')
  @UseInterceptors(FilesInterceptor('files', 30, { storage: memoryStorage() }))
  uploadBatch(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: UploadBatchDto,
  ) {
    return this.service.uploadBatch(id, files, dto);
  }

  @Delete('batches/:id')
  deleteBatch(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteBatch(id);
  }

  @Delete('files/:id')
  deleteFile(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteFile(id);
  }
}