import Event from '@models/Event';
import Database from '../../utils/Database';

describe('Models: Event', () => {
  beforeAll(async () => {
    await Database.getInstance();
  });

  afterAll(async () => {
    await Database.close();
  });

  const model = Event;
  it('should have name Event', () => expect(Event.name).toBe('Event'));

  describe('proprieties', () => {
    const attributes = [
      {
        name: 'id',
        type: 'INTEGER',
      },
      {
        name: 'emailId',
        type: 'INTEGER',
      },
      {
        name: 'contactId',
        type: 'INTEGER',
      },
      {
        name: 'eventType',
        type: 'ENUM',
        values: [
          'reject',
          'bounce',
          'complaint',
          'delivery',
          'open',
          'click',
          'render_failure',
        ],
      },
      {
        name: 'eventDetails',
        type: 'JSON',
      },
    ];

    attributes.map(({ name }) =>
      it(`should have an attribute '${name}'`, () =>
        expect(model.rawAttributes).toHaveProperty(name)),
    );

    attributes.map(({ name, type, values }) =>
      it(`should have attribute '${name}' of type ${type}`, () =>
        expect(model.rawAttributes[name].type).toEqual(
          expect.objectContaining(
            values ? { key: type, values } : { key: type },
          ),
        )),
    );
  });
});
