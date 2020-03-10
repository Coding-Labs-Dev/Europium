import Tag from '@models/Tag';
import Database from '../../utils/Database';

describe('Models: Tag', () => {
  beforeAll(async () => {
    await Database.getInstance();
  });

  afterAll(async () => {
    await Database.close();
  });

  const model = Tag;
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
