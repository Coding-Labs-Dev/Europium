import {
  sequelize,
  checkModelName,
  checkPropertyExists,
} from 'sequelize-test-helpers';

import { init as Model } from '@models/Event';

describe('Models: Event', () => {
  const Events = Model(sequelize);
  const events = new Events();
  checkModelName(Events)('Event');

  describe('proprieties', () => {
    const attributes = [
      'id',
      'email_id',
      'contact_id',
      'event_type',
      'event_detail',
    ];
    attributes.map(checkPropertyExists(events));
  });
});
