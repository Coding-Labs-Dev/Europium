import {
  sequelize,
  checkModelName,
  checkPropertyExists,
} from 'sequelize-test-helpers';

import { init as Model } from '@models/Email';

describe('Models: Email', () => {
  const Email = Model(sequelize);
  const email = new Email();
  checkModelName(Email)('Email');

  describe('proprieties', () => {
    const attributes = ['id', 'sent', 'template_id', 'variables'];
    attributes.map(checkPropertyExists(email));
  });

  describe('associations', () => {
    const Template = '';
    const spy = jest.spyOn(Email, 'belongsTo');

    expect(Email.belongsTo).toHaveBeenCalledWith(Template);
  });
});
