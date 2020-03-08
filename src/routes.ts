import { Router, Request, Response, NextFunction } from 'express';

import UploadFileService from '@services/UploadFileService';

import UploadFileController from '@controllers/UploadFileController';
import ImportContactsController from '@controllers/ImportContactsController';
import TemplateController from '@controllers/TemplateController';

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
  wrapper(UploadFileController.store),
);

routes.post('/contacts/import', wrapper(ImportContactsController.store));

routes.post('/templates/new', wrapper(TemplateController.store));
routes.get('/templates/:id', wrapper(TemplateController.show));

export default routes;
