/* eslint-disable @typescript-eslint/camelcase */
import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
import connection from '@database/index';

interface TemplateModel extends Model {
  readonly id: number;
  readonly name: string | null;
  readonly email: string;
  readonly alternate_names: string[] | null;
  readonly active: boolean;
  readonly created_at: Date;
  readonly updated_at: Date;
}

type TemplateStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): TemplateModel;
};

export const init = (sequelize: Sequelize): TemplateStatic => {
  const Template = sequelize.define('Template', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    variables: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }) as TemplateStatic;
  return Template;
};

export default init(connection);
