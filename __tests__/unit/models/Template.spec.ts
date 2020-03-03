import SequelizeMock from 'sequelize-mock';
import { DataTypes } from 'sequelize';

import Template, { TemplateAttributes } from '@models/Template';

describe('Models: Template', () => {
  const sequelize = new SequelizeMock();
  const model = sequelize.define(Template.name, TemplateAttributes);

  it('should have name Template', () => expect(Template.name).toBe('Template'));

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
        name: 'path',
        type: DataTypes.STRING,
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
