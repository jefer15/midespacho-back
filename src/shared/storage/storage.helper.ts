import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const caseStorage = diskStorage({
  destination: (req: any, file, cb) => {

    const caseNumber = req.body.caseNumber;
    const batchIndex = req.body.batchIndex;

    const folderPath = join(
      process.cwd(),
      'public',
      'cases',
      caseNumber,
      `batch-${batchIndex}`,
    );

    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },

  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});