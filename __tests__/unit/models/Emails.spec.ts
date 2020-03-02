import {
  sequelize,
  checkModelName,
  checkPropertyExists,
} from 'sequelize-test-helpers';

import { init as Model } from '@models/Emails';

describe('Models: Emails', () => {
  const Emails = Model(sequelize);
  const emails = new Emails();
  checkModelName(Emails)('Emails');

  describe('proprieties', () => {
    const attributes = ['id', 'sent', 'template_id', 'variables'];
    attributes.map(checkPropertyExists(emails));
  });
});
