import {
  sequelize,
  checkModelName,
  checkPropertyExists,
} from 'sequelize-test-helpers';

import { init as Model } from '@models/Email';

describe('Models: Email', () => {
  const Emails = Model(sequelize);
  const emails = new Emails();
  checkModelName(Emails)('Email');

  describe('proprieties', () => {
    const attributes = ['id', 'sent', 'template_id', 'variables'];
    attributes.map(checkPropertyExists(emails));
  });
});
