import Email from '@models/Email';
import Database from '../../utils/Database';

describe('Models: Email', () => {
  beforeAll(async () => {
    await Database.getInstance();
  });

  afterAll(async () => {
    await Database.close();
  });

  it('should have name Email', () => expect(Email.name).toBe('Email'));

  describe('proprieties', () => {
    const attributes = [
      {
        name: 'id',
        type: 'INTEGER',
      },
      {
        name: 'name',
        type: 'STRING',
      },
      {
        name: 'sent',
        type: 'DATE',
      },
      {
        name: 'templateId',
        type: 'INTEGER',
      },
      {
        name: 'variables',
        type: 'JSON',
      },
    ];

    attributes.map(({ name }) =>
      it(`should have an attribute '${name}'`, () =>
        expect(Email.rawAttributes).toHaveProperty(name)),
    );

    attributes.map(({ name, type }) =>
      it(`should have attribute '${name}' of type ${type}`, () =>
        expect(Email.rawAttributes[name].type).toEqual(
          expect.objectContaining({ key: type }),
        )),
    );
  });
});
