import { Readable } from 'stream';
import { Request, Response } from 'express';
import Sequelize from 'sequelize';
import ImportContactService from '@services/ImportContactService';
import S3 from 'aws-sdk/clients/s3';

import { Contact, Tag, ContactTag } from '@models/index';

const s3 = new S3({ region: 'us-east-1' });

class ImportController {
  async store(req: Request, res: Response): Promise<Response> {
    const importContacts = new ImportContactService();

    const { fileKey } = req.body;

    const file = await s3
      .getObject({
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
      })
      .promise();

    const data = file.Body as Buffer | Uint8Array | Blob | string | Readable;

    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
      })
      .promise();

    if (!data)
      return res.status(400).json({ error: { message: `Empty file` } });

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
