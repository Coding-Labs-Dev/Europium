import ExportContactService from '@services/ExportContactService';

describe('Export', () => {
  it('should create a csv file with data from json', async () => {
    const data = [
      {
        email: 'lukitalima7@gmail.com',
        name: '',
        tags: ['EMAIL LESTE EUROPEU'],
      },
      {
        email: 'npetrulis@yahoo.com.br',
        name: 'N Pp',
        tags: ['EMAIL TRANSIBERIANO 2019'],
      },
      {
        email: 'crismari28@hotmail.com',
        name: 'Cristina',
        tags: ['E mails SITE BRASIL ORIENTE'],
      },
      {
        email: 'embaroni@bol.com.br',
        name: 'Eduardo Martins Mantovani Baroni',
        tags: ['BO 2014'],
      },
      {
        email: 'eunicefcf@gmail.com',
        name: 'Eunice de Fátima Chaves Figueiredo',
        tags: ['BO 2014'],
      },
    ];

    const exportContactService = new ExportContactService();
    const csv = await exportContactService.run(data);

    expect(csv).toEqual(
      expect.stringMatching(
        'email;name;tags\nlukitalima7@gmail.com;;EMAIL LESTE EUROPEU\nnpetrulis@yahoo.com.br;N Pp;EMAIL TRANSIBERIANO 2019\ncrismari28@hotmail.com;Cristina;E mails SITE BRASIL ORIENTE\nembaroni@bol.com.br;Eduardo Martins Mantovani Baroni;BO 2014\neunicefcf@gmail.com;Eunice de Fátima Chaves Figueiredo;BO 2014',
      ),
    );
  });
});
