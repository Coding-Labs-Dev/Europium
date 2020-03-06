import { Router } from 'express';

import UploadFileService from '@services/UploadFileService';

import ImportController from '@controllers/ImportContactsController';
import UploadFileController from '@controllers/UploadFileController';

const routes = Router();

routes.post(
  '/upload/:type',
  UploadFileService.single('file'),
  UploadFileController.store,
);

routes.post('/contacts/import', ImportController.store);

export default routes;
