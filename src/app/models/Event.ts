import {
  Sequelize,
  Model,
  ModelCtor,
  DataTypes,
  BuildOptions,
} from 'sequelize';

interface EventModel extends Model {
  readonly id: number;
  readonly emailId: number;
  readonly contactId: number;
  readonly eventType:
    | 'reject'
    | 'bounce'
    | 'complaint'
    | 'delivery'
    | 'open'
    | 'click'
    | 'render_failure';
  readonly eventDetails: object;
}

type EventStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): EventModel;
} & {
  _defaults: { [key: string]: { [key: string]: object | string | boolean } };
};

const EventAttributes = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  emailId: {
    type: DataTypes.INTEGER,
    references: { model: 'Emails', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    allowNull: false,
  },
  contactId: {
    type: DataTypes.INTEGER,
    references: { model: 'Contacts', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    allowNull: false,
  },
  eventType: {
    type: DataTypes.ENUM(
      'reject',
      'bounce',
      'complaint',
      'delivery',
      'open',
      'click',
      'render_failure',
    ),
    allowNull: false,
  },
  eventDetails: {
    type: DataTypes.JSON,
    allowNull: false,
  },
};

export default class Event extends Model<EventModel, EventStatic> {}

export const factory = (sequelize: Sequelize): void =>
  Event.init(EventAttributes, { sequelize });

export const associate = (models: {
  [key: string]: ModelCtor<Model>;
}): void => {
  Event.belongsTo(models.Email, {
    foreignKey: 'emailId',
    as: 'email',
  });
  Event.belongsTo(models.Contact, {
    foreignKey: 'contactId',
    as: 'contact',
  });
};
