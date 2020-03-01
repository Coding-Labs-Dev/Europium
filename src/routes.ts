import { Router, Request, Response } from 'express';

import UploadFileService from '@services/UploadFileService';

import ImportController from '@controllers/ImportController';

import Contact from '@models/Contact';

const routes = Router();

routes.post(
  '/contacts/import',
  UploadFileService.single('file'),
  ImportController.store,
);

routes.post('/', async (req: Request, res: Response) => {
  const contact = await Contact.create({
    name: 'Luis',
    email: 'luismramirezr@me.com',
  });

  return res.json(contact);
});

export default routes;
