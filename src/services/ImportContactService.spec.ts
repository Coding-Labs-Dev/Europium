import { Readable } from 'stream';
import ImportContactService from '@services/ImportContactService';

describe('Import', () => {
  it('should be able to import contacts', async () => {
    // Arquivo CSV
    // Importar CSV
    // Criar
    const contactsFileStream = Readable.from([
      'LUKITALIMA7@GMAIL.COM;EMAIL LESTE EUROPEU;\n',
      'N pp <npetrulis@yahoo.com.br>;EMAIL TRANSIBERIANO 2019;\n',
      'crismari28@hotmail.com;E mails SITE BRASIL ORIENTE;CRISTINA\n',
      'embaroni@bol.com.br;BO 2014;EDUARDO MARTINS MANTOVANI BARONI\n',
      'eunicefcf@gmail.com;BO 2014;EUNICE DE FÁTIMA CHAVES FIGUEIREDO',
    ]);

    const importContacts = new ImportContactService();

    await importContacts.run(contactsFileStream);

    const { contacts } = importContacts;

    expect(contacts).toEqual([
      expect.objectContaining({
        email: 'lukitalima7@gmail.com',
        name: '',
        tags: ['EMAIL LESTE EUROPEU'],
      }),
      expect.objectContaining({
        email: 'npetrulis@yahoo.com.br',
        name: 'N Pp',
        tags: ['EMAIL TRANSIBERIANO 2019'],
      }),
      expect.objectContaining({
        email: 'crismari28@hotmail.com',
        tags: ['E mails SITE BRASIL ORIENTE'],
        name: 'Cristina',
      }),
      expect.objectContaining({
        email: 'embaroni@bol.com.br',
        tags: ['BO 2014'],
        name: 'Eduardo Martins Mantovani Baroni',
      }),
      expect.objectContaining({
        email: 'eunicefcf@gmail.com',
        tags: ['BO 2014'],
        name: 'Eunice de Fátima Chaves Figueiredo',
      }),
    ]);
  });
});
