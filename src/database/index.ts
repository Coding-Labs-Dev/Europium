import { Sequelize } from 'sequelize';

import databaseConfig from '@config/database';

import Template, { TemplateAttributes } from '@models/Template';
import Email, { EmailAttributes } from '@models/Email';
import Contact, { ContactAttributes } from '@models/Contact';
import Event, { EventAttributes } from '@models/Event';

const models = [
  {
    model: Template,
    attributes: TemplateAttributes,
  },
  {
    model: Email,
    attributes: EmailAttributes,
  },
  {
    model: Contact,
    attributes: ContactAttributes,
  },
  {
    model: Event,
    attributes: EventAttributes,
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
