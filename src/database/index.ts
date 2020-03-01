import { Sequelize } from 'sequelize';

import Contact from '@models/Contact';

import databaseConfig from '@config/database';

const models = [Contact];

class Database {
  public connection: Sequelize;

  constructor() {
    this.init();
  }

  init(): void {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.initiator(this.connection));
  }
}

export default new Database();
