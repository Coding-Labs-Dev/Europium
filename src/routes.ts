import { Router, Request, Response } from 'express';

import UploadFileService from '@services/UploadFileService';

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
    // const template = await Template.findAll();

    // const contact = await Contact.create({
    //   name: 'Test',
    //   email: 'email@email.com',
    // });

    // console.log(contact);

    // const contact = await Contact.findOne({
    //   where: { id: 1 },
    //   include: [{ model: Tags }],
    // });

    // return res.json(await Contact.findAll({ include: [{ model: Tag }] }));
    return res.json(
      await Contact.findOne({ where: { id: 1 }, include: ['tags'] }),
    );
    // return res.json(await Contact.findAll());
  } catch (err) {
    return res.json(err);
  }
});

export default routes;
