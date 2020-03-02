import { Router, Request, Response } from 'express';

import UploadFileService from '@services/UploadFileService';

import ImportController from '@controllers/ImportController';

// import Contact from '@models/Contact';
import Template from '@models/Template';
// import Email from '@models/Email';

const routes = Router();

routes.post(
  '/contacts/import',
  UploadFileService.single('file'),
  ImportController.store,
);

routes.post('/', async (req: Request, res: Response) => {
  try {
    const template = await Template.findAll();
    // const email = await Email.findOne({
    //   where: {
    //     id: 1,
    //   },
    //   include: [
    //     {
    //       model: Template,
    //     },
    //   ],
    // });

    return res.json(template);
  } catch (err) {
    return res.json(err);
  }
});

export default routes;
