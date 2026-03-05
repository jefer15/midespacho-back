import { Injectable } from '@nestjs/common';
import { extname, join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {

  async ensureFolder(path: string) {

    if (!existsSync(path)) {
      await mkdir(path, { recursive: true });
    }
  }

  async saveFile(
    folder: string,
    file: Express.Multer.File,
  ) {

    const extension = extname(file.originalname);

    const fileName = `${uuidv4()}${extension}`;

    const fullPath = join(folder, fileName);

    await writeFile(fullPath, file.buffer);

    return {
      storedName: fileName,
      fullPath,
    };
  }
}