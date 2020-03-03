import { Sequelize } from 'sequelize';

import databaseConfig from '@config/database';

import models from '@models/index';

class Database {
  public connection: Sequelize;

  constructor() {
    this.init();
  }

  init(): void {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => {
        const { model: Model, attributes } = model;
        Model.init(attributes, { sequelize: this.connection });
        return model;
      })
      .forEach(
        ({ model }) =>
          model.associate && model.associate(this.connection.models),
      );
  }
}

export default new Database().connection;
