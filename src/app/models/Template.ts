/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes, BuildOptions } from 'sequelize';

interface TemplateModel extends Model {
  readonly id: number;
  readonly name: string;
  readonly path: string;
  readonly variables: string[] | null;
  readonly created_at: Date;
  readonly updated_at: Date;
}

type TemplateStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): TemplateModel;
};

export default class Template extends Model<TemplateModel, TemplateStatic> {}

export const TemplateAttributes = {
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
};
