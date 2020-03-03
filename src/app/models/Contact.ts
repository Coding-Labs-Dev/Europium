/* eslint-disable @typescript-eslint/camelcase */
import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';

interface ContactModel extends Model {
  readonly id: number;
  readonly name: string | null;
  readonly email: string;
  readonly alternate_names: string[] | null;
  readonly active: boolean;
  readonly created_at: Date;
  readonly updated_at: Date;
}

type ContactStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ContactModel;
};

export const ContactAttributes = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  alternate_names: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
};

export default class Contact extends Model<ContactModel, ContactStatic> {}
