import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

import ImportContactService from '@services/ImportContactService';
import ExportContactService from '@services/ExportContactService';

class ImportController {
  async store(req: Request, res: Response): Promise<Response> {
    const { filename } = req.file;
    const { download } = req.query;

    const importContacts = new ImportContactService();
    const exportContactService = new ExportContactService();

    const contactsReadStream = fs.createReadStream(
      path.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', filename),
    );

    await importContacts.run(contactsReadStream);

    const { contacts, invalid, duplicated } = importContacts;

    const csv = await exportContactService.run(contacts);

    if (download) {
      res.attachment('email=list.csv');
      return res.status(200).send(csv);
    }
    res.attachment('email=list.csv');
    return res.json({ invalid, duplicated, contacts }).send(csv);
  }
}

export default new ImportController();
