import { Request, Response } from 'express';
import Sequelize from 'sequelize';
import ImportContactService from '@services/ImportContactService';
import { getFile, deleteFile } from '@utils/File';

import { Contact, Tag, ContactTag } from '@models/index';

const arrayChunks = (array: Array<any>, chunk: number): Array<Array<any>> =>
  Array(Math.ceil(array.length / chunk))
    .fill(0)
    .map((_, index) => index * chunk)
    .map(begin => array.slice(begin, begin + chunk));

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
      { updateOnDuplicate: ['name', 'alternateNames'] },
    );

    const associateData: { contactId: number; tagId: number }[] = [];
    contacts.forEach(contact => {
      const contactId: number = newContacts.filter(
        ({ email }) => contact.email === email,
      )[0].id;
      const tagsIds = allTags
        .filter(({ name }) => contact.tags.includes(name))
        .map(({ id }) => id);

      const associationsData = tagsIds.map(tagId => ({ contactId, tagId }));
      associationsData.forEach(item => associateData.push(item));
    });

    await Promise.all(
      arrayChunks(associateData, 1000).map(contactsTags =>
        ContactTag.bulkCreate(contactsTags),
      ),
    );

    return res.json({
      invalid,
      duplicated,
      tags,
      contacts,
    });
  }
}

export default new ImportController();
