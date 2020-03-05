// @ts-nocheck
import { Readable } from 'stream';
import ImportContactService from '@services/ImportContactService';
import Database from '@database/index';
import { Contact, Tag, ContactTag } from '@models/index';
import Sequelize from 'sequelize';
import { associate } from '@models/Contact';

beforeAll(async () => {
  await Database.sync({ force: true, logging: false });
});

afterAll(async () => Database.close());

describe('Import Controller: Store', () => {
  it('should be able to import a contact, create tags and save it', async () => {
    const contactsFileStream = Readable.from([
      'LUKITALIMA7@GMAIL.COM;EMAIL LESTE EUROPEU;\n',
      'N pp <npetrulis@yahoo.com.br>;EMAIL TRANSIBERIANO 2019;\n',
      'crismari28@hotmail.com;E mails SITE BRASIL ORIENTE;CRISTINA\n',
      'embaroni@bol.com.br;BO 2014;EDUARDO MARTINS MANTOVANI BARONI\n',
      'eunicefcf@gmail.com;BO 2014;EUNICE DE FÁTIMA CHAVES FIGUEIREDO\n',
      'eunicefcf@gmail.com;BO 2019;Eunice\n',
      'eunicefcf@gmail.com;;\n',
    ]);

    const importContacts = new ImportContactService();

    await importContacts.run(contactsFileStream);

    const { contacts, tags } = importContacts;

    expect(contacts).toEqual([
      expect.objectContaining({
        email: 'lukitalima7@gmail.com',
        name: null,
        tags: ['EMAIL LESTE EUROPEU'],
        alternateNames: null,
      }),
      expect.objectContaining({
        email: 'npetrulis@yahoo.com.br',
        name: 'N Pp',
        tags: ['EMAIL TRANSIBERIANO 2019'],
        alternateNames: null,
      }),
      expect.objectContaining({
        email: 'crismari28@hotmail.com',
        tags: ['E mails SITE BRASIL ORIENTE'],
        alternateNames: null,
        name: 'Cristina',
      }),
      expect.objectContaining({
        email: 'embaroni@bol.com.br',
        tags: ['BO 2014'],
        alternateNames: null,
        name: 'Eduardo Martins Mantovani Baroni',
      }),
      expect.objectContaining({
        email: 'eunicefcf@gmail.com',
        tags: ['BO 2014', 'BO 2019'],
        name: 'Eunice de Fátima Chaves Figueiredo',
        alternateNames: ['Eunice'],
      }),
    ]);

    const newTags = await Tag.bulkCreate(
      tags.map(name => ({ name })),
      { ignoreDuplicates: true },
    );

    const expectedTags = [
      expect.objectContaining({ name: 'EMAIL LESTE EUROPEU' }),
      expect.objectContaining({ name: 'EMAIL TRANSIBERIANO 2019' }),
      expect.objectContaining({ name: 'E mails SITE BRASIL ORIENTE' }),
      expect.objectContaining({ name: 'BO 2014' }),
      expect.objectContaining({ name: 'BO 2019' }),
    ];

    expect(newTags).toEqual(expect.arrayContaining(expectedTags));

    const allTags = await Tag.findAll({
      where: Sequelize.or({ name: tags }),
    });

    expect(allTags).toEqual(expect.arrayContaining(expectedTags));

    const newContacts = await Contact.bulkCreate(
      contacts.map(contact => {
        const newContact = { ...contact };
        delete newContact.tags;
        return newContact;
      }),
    );

    const expectedNewContacts = [
      expect.objectContaining({
        email: 'lukitalima7@gmail.com',
        name: null,
        active: true,
        alternateNames: null,
      }),
      expect.objectContaining({
        email: 'npetrulis@yahoo.com.br',
        name: 'N Pp',
        active: true,
        alternateNames: null,
      }),
      expect.objectContaining({
        email: 'crismari28@hotmail.com',
        active: true,
        alternateNames: null,
        name: 'Cristina',
      }),
      expect.objectContaining({
        email: 'embaroni@bol.com.br',
        active: true,
        alternateNames: null,
        name: 'Eduardo Martins Mantovani Baroni',
      }),
      expect.objectContaining({
        email: 'eunicefcf@gmail.com',
        name: 'Eunice de Fátima Chaves Figueiredo',
        active: true,
        alternateNames: ['Eunice'],
      }),
    ];

    expect(newContacts).toEqual(expectedNewContacts);

    const associateData = [];

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

    const associations = await ContactTag.bulkCreate(associateData);

    const expectAssociations = [
      expect.objectContaining({ contactId: 1, tagId: 1 }),
      expect.objectContaining({ contactId: 2, tagId: 2 }),
      expect.objectContaining({ contactId: 3, tagId: 3 }),
      expect.objectContaining({ contactId: 4, tagId: 4 }),
      expect.objectContaining({ contactId: 5, tagId: 4 }),
      expect.objectContaining({ contactId: 5, tagId: 5 }),
    ];

    expect(associations).toEqual(expectAssociations);

    const updatedContacts = await Contact.findAll({
      include: ['tags'],
    });

    const expectedContacts = [
      expect.objectContaining({
        email: 'lukitalima7@gmail.com',
        name: null,
        active: true,
        alternateNames: null,
        tags: [expect.objectContaining({ name: 'EMAIL LESTE EUROPEU' })],
      }),
      expect.objectContaining({
        email: 'npetrulis@yahoo.com.br',
        name: 'N Pp',
        active: true,
        alternateNames: null,
        tags: [expect.objectContaining({ name: 'EMAIL TRANSIBERIANO 2019' })],
      }),
      expect.objectContaining({
        email: 'crismari28@hotmail.com',
        active: true,
        alternateNames: null,
        tags: [
          expect.objectContaining({ name: 'E mails SITE BRASIL ORIENTE' }),
        ],
        name: 'Cristina',
      }),
      expect.objectContaining({
        email: 'embaroni@bol.com.br',
        active: true,
        alternateNames: null,
        tags: [expect.objectContaining({ name: 'BO 2014' })],
        name: 'Eduardo Martins Mantovani Baroni',
      }),
      expect.objectContaining({
        email: 'eunicefcf@gmail.com',
        name: 'Eunice de Fátima Chaves Figueiredo',
        active: true,
        alternateNames: ['Eunice'],
        tags: [
          expect.objectContaining({ name: 'BO 2014' }),
          expect.objectContaining({ name: 'BO 2019' }),
        ],
      }),
    ];

    expect(updatedContacts).toEqual(expectedContacts);
  });
});
