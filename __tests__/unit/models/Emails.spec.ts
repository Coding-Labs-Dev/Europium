import SequelizeMock from 'sequelize-mock';
import { DataTypes } from 'sequelize';

import Email, { EmailAttributes } from '@models/Email';

describe('Models: Email', () => {
  const sequelize = new SequelizeMock();
  const model = sequelize.define(Email.name, EmailAttributes);

  it('should have name Email', () => expect(Email.name).toBe('Email'));

  describe('proprieties', () => {
    const attributes = [
      {
        name: 'id',
        type: DataTypes.INTEGER,
      },
      {
        name: 'sent',
        type: DataTypes.DATE,
      },
      {
        name: 'template_id',
        type: DataTypes.INTEGER,
      },
      {
        name: 'variables',
        type: DataTypes.JSON,
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
