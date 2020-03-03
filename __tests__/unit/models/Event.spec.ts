import SequelizeMock from 'sequelize-mock';
import { DataTypes } from 'sequelize';

import Event, { EventAttributes } from '@models/Event';

describe('Models: Event', () => {
  const sequelize = new SequelizeMock();
  const model = sequelize.define(Event.name, EventAttributes);

  it('should have name Event', () => expect(Event.name).toBe('Event'));

  describe('proprieties', () => {
    const attributes = [
      {
        name: 'id',
        type: DataTypes.INTEGER,
      },
      {
        name: 'email_id',
        type: DataTypes.INTEGER,
      },
      {
        name: 'contact_id',
        type: DataTypes.INTEGER,
      },
      {
        name: 'event_type',
        type: DataTypes.ENUM(
          'reject',
          'bounce',
          'complaint',
          'delivery',
          'open',
          'click',
          'render_failure',
        ),
      },
      {
        name: 'event_detail',
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
