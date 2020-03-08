import { Router, Request, Response, NextFunction } from 'express';

import UploadFileService from '@services/UploadFileService';

import ImportContactsController from '@controllers/ImportContactsController';
import UploadFileController from '@controllers/UploadFileController';

function wrapper(
  fn: Function,
): (req: Request, res: Response, next: NextFunction) => void {
  const wrapperFn = (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
  return wrapperFn;
}

const routes = Router();

routes.post(
  '/upload/:type',
  UploadFileService.single('file'),
  UploadFileController.store,
);

routes.post('/contacts/import', wrapper(ImportContactsController.store));

export default routes;
