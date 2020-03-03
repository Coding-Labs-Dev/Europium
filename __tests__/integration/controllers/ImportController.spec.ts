/* eslint-disable @typescript-eslint/camelcase */
import { Readable } from 'stream';
import ImportContactService from '@services/ImportContactService';
import Database from '@database/index';
import Contact from '@models/Contact';

beforeAll(async () => {
  await Database.sync({ force: true }).asCallback(() => {
    console.log('======= DONE =======');
  });
});

describe('Import Controller: Store', () => {
  it('should be able to import and save a contact', async () => {
    const contactsFileStream = Readable.from([
      'crismari28@hotmail.com;E mails SITE BRASIL ORIENTE;CRISTINA\n',
    ]);

    const importContacts = new ImportContactService();

    await importContacts.run(contactsFileStream);

    const { contacts } = importContacts;

    await Contact.create(contacts[0]);

    const contact = await Contact.findOne({ where: { id: 1 } });

    expect(contact).toEqual(
      expect.objectContaining({
        email: 'crismari28@hotmail.com',
        name: 'Cristina',
        alternate_names: [],
      }),
    );
  });
});
