import { Router, Request, Response, NextFunction } from 'express';
import * as yup from 'yup';

import UploadFileMiddleware from '@middlewares/UploadFileMiddleware';
import ValidatorMiddleware from '@middlewares/ValidatorMiddleware';

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

const validationSchema = yup.object().shape({
  id: yup
    .string()
    .email()
    .required(),
  // .required(),
  name: yup.string().required(),
});

const routes = Router();

routes.post(
  '/upload/:type',
  UploadFileMiddleware.single('file'),
  wrapper(UploadFileController.store),
);

routes.post('/contacts/import', wrapper(ImportContactsController.store));

routes.post('/templates', wrapper(TemplateController.store));
routes.get(
  '/templates/:id',
  ValidatorMiddleware(validationSchema),
  wrapper(TemplateController.show),
);

export default routes;
