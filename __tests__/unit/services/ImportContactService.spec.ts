import { Readable } from 'stream';
import ImportContactService from '@services/ImportContactService';

describe('Import', () => {
  it('should be able to import contacts', async () => {
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

    const { contacts } = importContacts;

    expect(contacts).toEqual([
      expect.objectContaining({
        email: 'lukitalima7@gmail.com',
        name: '',
        tags: ['EMAIL LESTE EUROPEU'],
        alternateNames: [],
      }),
      expect.objectContaining({
        email: 'npetrulis@yahoo.com.br',
        name: 'N Pp',
        tags: ['EMAIL TRANSIBERIANO 2019'],
        alternateNames: [],
      }),
      expect.objectContaining({
        email: 'crismari28@hotmail.com',
        tags: ['E mails SITE BRASIL ORIENTE'],
        alternateNames: [],
        name: 'Cristina',
      }),
      expect.objectContaining({
        email: 'embaroni@bol.com.br',
        tags: ['BO 2014'],
        alternateNames: [],
        name: 'Eduardo Martins Mantovani Baroni',
      }),
      expect.objectContaining({
        email: 'eunicefcf@gmail.com',
        tags: ['BO 2014', 'BO 2019'],
        name: 'Eunice de Fátima Chaves Figueiredo',
        alternateNames: ['Eunice'],
      }),
    ]);
  });
  it('should not repeat an already imported e-mail', async () => {
    const contactsFileStream = Readable.from([
      'eunicefcf@gmail.com;BO 2019;Eunice\n',
      'eunicefcf@gmail.com;;',
    ]);

    const importContacts = new ImportContactService();

    await importContacts.run(contactsFileStream);

    const { contacts } = importContacts;

    expect(contacts).toEqual([
      expect.objectContaining({
        email: 'eunicefcf@gmail.com',
        tags: ['BO 2019'],
        name: 'Eunice',
        alternateNames: [],
      }),
    ]);
  });
  it('should add new possible contact names when importing a repeated e-mail', async () => {
    const contactsFileStream = Readable.from([
      'eunicefcf@gmail.com;BO 2019;Eunice\n',
      'eunicefcf@gmail.com;;Eunice Faria',
    ]);

    const importContacts = new ImportContactService();

    await importContacts.run(contactsFileStream);

    const { contacts } = importContacts;

    expect(contacts).toEqual([
      expect.objectContaining({
        email: 'eunicefcf@gmail.com',
        tags: ['BO 2019'],
        name: 'Eunice',
        alternateNames: ['Eunice Faria'],
      }),
    ]);
  });
  it('should not repeat already possible names for the same e-mail', async () => {
    const contactsFileStream = Readable.from([
      'eunicefcf@gmail.com;BO 2019;Eunice\n',
      'eunicefcf@gmail.com;;Eunice',
    ]);

    const importContacts = new ImportContactService();

    await importContacts.run(contactsFileStream);

    const { contacts } = importContacts;

    expect(contacts).toEqual([
      expect.objectContaining({
        email: 'eunicefcf@gmail.com',
        tags: ['BO 2019'],
        name: 'Eunice',
        alternateNames: [],
      }),
    ]);
  });
  it('should add altName as name if no name is found', async () => {
    const contactsFileStream = Readable.from([
      'eunicefcf@gmail.com;BO 2019;\n',
      'eunicefcf@gmail.com;;Eunice',
    ]);

    const importContacts = new ImportContactService();

    await importContacts.run(contactsFileStream);

    const { contacts } = importContacts;

    expect(contacts).toEqual([
      expect.objectContaining({
        email: 'eunicefcf@gmail.com',
        tags: ['BO 2019'],
        name: 'Eunice',
        alternateNames: [],
      }),
    ]);
  });
  it('should not repeat tags for the same e-mail', async () => {
    const contactsFileStream = Readable.from([
      'eunicefcf@gmail.com;BO 2019;Eunice\n',
      'eunicefcf@gmail.com;BO 2019;Eunice',
    ]);

    const importContacts = new ImportContactService();

    await importContacts.run(contactsFileStream);

    const { contacts } = importContacts;

    expect(contacts).toEqual([
      expect.objectContaining({
        email: 'eunicefcf@gmail.com',
        tags: ['BO 2019'],
        name: 'Eunice',
        alternateNames: [],
      }),
    ]);
  });
  it('should count duplicated e-mails', async () => {
    const contactsFileStream = Readable.from([
      'eunicefcf@gmail.com;BO 2019;Eunice\n',
      'eunicefcf@gmail.com;BO 2019;Eunice',
    ]);

    const importContacts = new ImportContactService();

    await importContacts.run(contactsFileStream);

    const { duplicated } = importContacts;

    expect(duplicated).toEqual([
      expect.objectContaining({
        email: 'eunicefcf@gmail.com',
        occurrences: 1,
      }),
    ]);
  });
  it('should count invalid e-mails', async () => {
    const contactsFileStream = Readable.from([
      'eunicefcf@gmail;BO 2019;Eunice\n',
      'eunicefcfgmail.com;BO 2019;Eunice',
    ]);

    const importContacts = new ImportContactService();

    await importContacts.run(contactsFileStream);

    const { invalid } = importContacts;

    expect(invalid).toEqual([
      expect.objectContaining({
        data: 'eunicefcf@gmail',
        origin: 'BO 2019',
        nameFromCSV: 'Eunice',
      }),
      expect.objectContaining({
        data: 'eunicefcfgmail.com',
        origin: 'BO 2019',
        nameFromCSV: 'Eunice',
      }),
    ]);
  });
});
