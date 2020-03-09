import { Request, Response } from 'express';
import Sequelize from 'sequelize';
import ImportContactService from '@services/ImportContactService';
import { getFile, deleteFile } from '@utils/File';

import { Contact, Tag, ContactTag } from '@models/index';

class ImportController {
  async store(req: Request, res: Response): Promise<Response> {
    const importContacts = new ImportContactService();

    const { fileKey } = req.body;

    const data = await getFile(fileKey);
    await deleteFile(fileKey);

    await importContacts.run(data);

    const { contacts, invalid, duplicated, tags } = importContacts;

    await Tag.bulkCreate(
      tags.map(name => ({ name })),
      { ignoreDuplicates: true },
    );

    const allTags = await Tag.findAll({
      where: Sequelize.or({ name: tags }),
    });

    const newContacts = await Contact.bulkCreate(
      contacts.map(contact => {
        const newContact = { ...contact };
        delete newContact.tags;
        return newContact;
      }),
    );

    const associateData: { contactId: number; tagId: number }[] = [];

    contacts.forEach(contact => {
      const contactId = newContacts.filter(
        ({ email }) => email === contact.email,
      )[0].id;
      const tagsIds = allTags
        .filter(({ name }) => contact.tags.includes(name))
        .map(({ id }) => id);

      const associationsData = tagsIds.map(tagId => ({ contactId, tagId }));
      associationsData.forEach(item => associateData.push(item));
    });

    await ContactTag.bulkCreate(associateData);

    return res.json({ invalid, duplicated, contacts, tags });
  }
}

export default new ImportController();
