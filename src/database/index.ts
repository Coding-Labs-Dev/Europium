import { Sequelize } from 'sequelize';

import databaseConfig from '@config/database';

import Template, { TemplateAttributes } from '@models/Template';

const models = [
  {
    model: Template,
    attributes: TemplateAttributes,
  },
];

class Database {
  public connection: Sequelize;

  constructor() {
    this.init();
  }

  init(): void {
    this.connection = new Sequelize(databaseConfig);

    models.map(({ model, attributes }) =>
      model.init(attributes, { sequelize: this.connection }),
    );
  }
}

export default new Database().connection;
