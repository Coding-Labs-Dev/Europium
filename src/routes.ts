import { Router, Request, Response } from 'express';

import UploadFileService from '@services/UploadFileService';
import SendEmailService from '@services/SendEmailService';

import ImportController from '@controllers/ImportController';

import { Contact, Tag } from '@models/index';
// import Template from '@models/Template';
// import Email from '@models/Email';

const routes = Router();

routes.post(
  '/contacts/import',
  UploadFileService.single('file'),
  ImportController.store,
);

routes.post('/', async (req: Request, res: Response) => {
  try {
    const sendEmailService = new SendEmailService();
    await sendEmailService.run();
    return res.json({ ok: true });
  } catch (err) {
    return res.json(err);
  }
});

export default routes;
