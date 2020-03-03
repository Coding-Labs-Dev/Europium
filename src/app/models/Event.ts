/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes, BuildOptions } from 'sequelize';

interface EventModel extends Model {
  readonly id: number;
  readonly email_id: number;
  readonly contact_id: number;
  readonly event_type:
    | 'reject'
    | 'bounce'
    | 'complaint'
    | 'delivery'
    | 'open'
    | 'click'
    | 'render_failure';
  readonly event_detail: object;
  readonly created_at: Date;
  readonly updated_at: Date;
}

type EventStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): EventModel;
};

export default class Event extends Model<EventModel, EventStatic> {
  static associate?: () => void;
}

export const EventAttributes = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  email_id: {
    type: DataTypes.INTEGER,
    references: { model: 'Email', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    allowNull: false,
  },
  contact_id: {
    type: DataTypes.INTEGER,
    references: { model: 'Contact', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    allowNull: false,
  },
  event_type: {
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
  event_detail: {
    type: DataTypes.JSON,
    allowNull: false,
  },
};
