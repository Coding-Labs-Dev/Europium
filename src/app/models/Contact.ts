/* eslint-disable @typescript-eslint/camelcase */
import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
import connection from '@database/index';

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

export const init = (sequelize: Sequelize): ContactStatic => {
  const Contact = sequelize.define('Contact', {
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
  }) as ContactStatic;
  return Contact;
};

export default init(connection);
