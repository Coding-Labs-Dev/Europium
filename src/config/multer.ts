import multer from 'multer';
import { uuid } from 'uuidv4';
import { extname, resolve } from 'path';
import { Request } from 'express';

const multerConfig = {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void,
    ) => {
      const filename = `${uuid()}${extname(file.originalname)}`;
      return callback(null, filename);
    },
  }),
};

export default multerConfig;
