import { Sequelize } from 'sequelize';

import databaseConfig from '@config/database';

import * as Models from '@models/index';

import {
  factory as ContactFactory,
  associate as ContactAssociate,
} from '@models/Contact';

import { factory as TagFactory, associate as TagAssociate } from '@models/Tag';

import {
  factory as EmailFactory,
  associate as EmailAssociate,
} from '@models/Email';

import {
  factory as EventFactory,
  associate as EventAssociate,
} from '@models/Event';

import {
  factory as TemplateFactory,
  associate as TemplateAssociate,
} from '@models/Template';

import { factory as ContactTagFactory } from '@models/ContactTag';
import { factory as ContactEmailFactory } from '@models/ContactEmail';

const models = [
  ContactFactory,
  TagFactory,
  EmailFactory,
  EventFactory,
  TemplateFactory,
  ContactTagFactory,
  ContactEmailFactory,
];

const associates = [
  ContactAssociate,
  TagAssociate,
  EmailAssociate,
  EventAssociate,
  TemplateAssociate,
];

class Database {
  public connection: Sequelize;

  constructor() {
    this.init();
  }

  async init(): Promise<void> {
    this.connection = new Sequelize(databaseConfig);

    models.forEach(model => model(this.connection));
    associates.forEach(associate => associate(Models));
  }
}

export default new Database().connection;
