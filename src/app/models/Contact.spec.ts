import {
  sequelize,
  checkModelName,
  checkPropertyExists,
} from 'sequelize-test-helpers';

import { init as Model } from '@models/Contact';

describe('Models: Contact', () => {
  const Contact = Model(sequelize);
  const contact = new Contact();
  checkModelName(Contact)('Contact');

  describe('proprieties', () => {
    const attributes = ['id', 'name', 'email', 'alternate_names', 'active'];
    attributes.map(checkPropertyExists(contact));
  });
});
