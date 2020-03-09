import { Router, Request, Response, NextFunction } from 'express';

/**
 * Middlewares
 */

import UploadFileMiddleware from '@middlewares/UploadFileMiddleware';
import ValidatorMiddleware from '@middlewares/ValidatorMiddleware';

/**
 * Controllers
 */

import UploadFileController from '@controllers/UploadFileController';
import ImportContactsController from '@controllers/ImportContactsController';
import TemplateController from '@controllers/TemplateController';

/**
 * Validators
 */

import UploadValidator from '@validators/UploadValidator';

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
  ValidatorMiddleware(UploadValidator),
  UploadFileMiddleware.single('file'),
  wrapper(UploadFileController.store),
);

routes.post('/contacts/import', wrapper(ImportContactsController.store));

routes.post('/templates', wrapper(TemplateController.store));
routes.get('/templates/:id', wrapper(TemplateController.show));

export default routes;
