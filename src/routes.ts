import { Router } from 'express';

import UploadFileService from '@services/UploadFileService';

import ImportController from '@controllers/ImportController';

const routes = Router();

routes.post(
  '/contacts/import',
  UploadFileService.single('file'),
  ImportController.store,
);

export default routes;
