import fs from 'fs';
import { resolve } from 'path';
import ImportController from '@controllers/ImportContactsController';
import { mockRequest, mockResponse } from 'mock-req-res';
import Database from '../../utils/Database';

describe('Import Controller: Store', () => {
  beforeAll(async () => {
    await Database.getInstance();
  });

  afterAll(async () => {
    await Database.close();
  });

  beforeEach(async () => {
    const fileData = [
      'LUKITALIMA7@GMAIL.COM;EMAIL LESTE EUROPEU;\n',
      'N pp <npetrulis@yahoo.com.br>;EMAIL TRANSIBERIANO 2019;\n',
      'crismari28@hotmail.com;E mails SITE BRASIL ORIENTE;CRISTINA\n',
      'embaroni@bol.com.br;BO 2014;EDUARDO MARTINS MANTOVANI BARONI\n',
      'eunicefcf@gmail.com;BO 2014;EUNICE DE FÁTIMA CHAVES FIGUEIREDO\n',
      'eunicefcf@gmail.com;BO 2019;Eunice\n',
      'eunicefcf@gmail.com;BO 2019;Eunice\n',
      'eunicefcf@gmail.com;;\n',
    ];
    fileData.forEach((line, i) => {
      fs.writeFileSync(resolve(process.cwd(), 'tmp', '__TEST__.csv'), line, {
        encoding: 'utf8',
        flag: i ? 'a' : 'w',
      });
    });
  });

  afterEach(() => {
    if (fs.existsSync(resolve(process.cwd(), 'tmp', '__TEST__.csv')))
      fs.unlinkSync(resolve(process.cwd(), 'tmp', '__TEST__.csv'));
  });

  it('should be able to import a contact, create tags and save it', async () => {
    const request = mockRequest({
      body: {
        fileKey: '__TEST__.csv',
      },
    });

    const response = mockResponse();
    jest.spyOn(response, 'json');

    await ImportController.store(request, response);

    const expected = {
      duplicated: [
        {
          email: 'eunicefcf@gmail.com',
          occurrences: 3,
        },
      ],
      invalid: [],
      tags: [
        'EMAIL LESTE EUROPEU',
        'EMAIL TRANSIBERIANO 2019',
        'E mails SITE BRASIL ORIENTE',
        'BO 2014',
        'BO 2019',
      ],
      contacts: [
        {
          email: 'lukitalima7@gmail.com',
          tags: ['EMAIL LESTE EUROPEU'],
          alternateNames: null,
          name: null,
        },
        {
          email: 'npetrulis@yahoo.com.br',
          tags: ['EMAIL TRANSIBERIANO 2019'],
          alternateNames: null,
          name: 'N Pp',
        },
        {
          email: 'crismari28@hotmail.com',
          tags: ['E mails SITE BRASIL ORIENTE'],
          alternateNames: null,
          name: 'Cristina',
        },
        {
          email: 'embaroni@bol.com.br',
          tags: ['BO 2014'],
          alternateNames: null,
          name: 'Eduardo Martins Mantovani Baroni',
        },
        {
          email: 'eunicefcf@gmail.com',
          tags: ['BO 2014', 'BO 2019'],
          alternateNames: ['Eunice'],
          name: 'Eunice de Fátima Chaves Figueiredo',
        },
      ],
    };

    expect(response.json).toHaveBeenCalledWith(expected);
  });
});
