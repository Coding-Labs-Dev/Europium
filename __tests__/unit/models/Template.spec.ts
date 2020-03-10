import Template from '@models/Template';
import Database from '../../utils/Database';

describe('Models: Template', () => {
  beforeAll(async () => {
    await Database.getInstance();
  });

  afterAll(async () => {
    await Database.close();
  });

  const model = Template;

  it('should have name Template', () => expect(Template.name).toBe('Template'));

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
        name: 'variables',
        type: 'JSON',
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
