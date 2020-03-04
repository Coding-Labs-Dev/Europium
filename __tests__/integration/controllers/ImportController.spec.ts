/* eslint-disable @typescript-eslint/camelcase */
// @ts-nocheck
import { Readable } from 'stream';
import ImportContactService from '@services/ImportContactService';
import Database from '@database/index';
import { Contact } from '@models/index';

beforeAll(async () => {
  await Database.sync({ force: true, logging: false });
});

afterAll(async () => Database.close());

describe('Import Controller: Store', () => {
  it('should be able to import and save a contact', async () => {
    const contactsFileStream = Readable.from([
      'crismari28@hotmail.com;E mails SITE BRASIL ORIENTE;CRISTINA\n',
    ]);

    const importContacts = new ImportContactService();

    await importContacts.run(contactsFileStream);

    const { contacts } = importContacts;

    await Contact.create(contacts[0]);

    const contact = await Contact.findOne({
      where: { id: 1 },
      // include: ['tags'],
    });

    expect(contact).toEqual(
      expect.objectContaining({
        name: 'Cristina',
        email: 'crismari28@hotmail.com',
        alternateNames: [],
        // tags: [],
      }),
    );
  });
});
