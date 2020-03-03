import SequelizeMock from 'sequelize-mock';
import { DataTypes } from 'sequelize';

import Contact, { ContactAttributes } from '@models/Contact';

describe('Models: Contact', () => {
  const sequelize = new SequelizeMock();
  const model = sequelize.define(Contact.name, ContactAttributes);

  it('should have name Contact', () => expect(Contact.name).toBe('Contact'));

  describe('proprieties', () => {
    const attributes = [
      {
        name: 'id',
        type: DataTypes.INTEGER,
      },
      {
        name: 'name',
        type: DataTypes.STRING,
      },
      {
        name: 'email',
        type: DataTypes.STRING,
      },
      {
        name: 'alternate_names',
        type: DataTypes.JSON,
      },
      {
        name: 'active',
        type: DataTypes.BOOLEAN,
      },
    ];

    attributes.map(({ name }) =>
      it(`should have an attribute '${name}'`, () =>
        expect(model._defaults).toHaveProperty(name)),
    );

    attributes.map(({ name, type }) =>
      it(`should have attribute '${name}' of type ${type}`, () =>
        expect(model._defaults[name].type).toStrictEqual(type)),
    );
  });
});
