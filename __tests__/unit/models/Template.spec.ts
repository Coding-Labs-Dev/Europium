import {
  sequelize,
  checkModelName,
  checkPropertyExists,
} from 'sequelize-test-helpers';

import Template, { TemplateAttributes } from '@models/Template';

describe('Models: Template', () => {
  Template.init(TemplateAttributes, sequelize);
  const template = new Template();
  checkModelName(Template)('Template');

  describe('proprieties', () => {
    const attributes = ['id', 'name', 'path', 'variables'];
    attributes.map(checkPropertyExists(template));
  });
});
