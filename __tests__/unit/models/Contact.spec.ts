import Contact from '@models/Contact';
import Database from '../../utils/Database';

describe('Models: Contact', () => {
  beforeAll(async () => {
    await Database.getInstance();
  });

  afterAll(async () => {
    await Database.close();
  });

  const model = Contact;
  it('should have name Contact', () => expect(Contact.name).toBe('Contact'));

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
        name: 'email',
        type: 'STRING',
      },
      {
        name: 'alternateNames',
        type: 'JSON',
      },
      {
        name: 'active',
        type: 'BOOLEAN',
      },
    ];

    attributes.map(({ name }) =>
      it(`should have an attribute '${name}'`, () =>
        expect(model.rawAttributes).toHaveProperty(name)),
    );

    attributes.map(({ name, type }) =>
      it(`should have attribute '${name}' of type ${type}`, () =>
        expect(model.rawAttributes[name].type).toEqual(
          expect.objectContaining({ key: type }),
        )),
    );
  });
});
