import {
  sequelize,
  checkModelName,
  checkPropertyExists,
} from 'sequelize-test-helpers';

import { init as Model } from '@models/Template';

describe('Models: Template', () => {
  const Template = Model(sequelize);
  const template = new Template();
  checkModelName(Template)('Template');

  describe('proprieties', () => {
    const attributes = ['id', 'name', 'path', 'variables'];
    attributes.map(checkPropertyExists(template));
  });
});
