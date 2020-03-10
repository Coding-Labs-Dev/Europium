import {
  Sequelize,
  Model,
  ModelCtor,
  DataTypes,
  BuildOptions,
} from 'sequelize';

export interface TemplateModel extends Model {
  readonly id: number;
  readonly name: string;
  readonly subject: string;
  readonly text: string | null;
  readonly html: string;
  readonly variables: string[] | null;
}

type TemplateStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): TemplateModel;
};

const TemplateAttributes = {
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
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  html: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  variables: {
    type: DataTypes.JSON,
    allowNull: true,
  },
};

export default class Template extends Model<TemplateModel, TemplateStatic> {
  readonly id: number;

  readonly name: string;

  readonly subject: string;

  readonly text: string | null;

  readonly html: string;

  readonly variables: string[] | null;
}

export const factory = (sequelize: Sequelize): void =>
  Template.init(TemplateAttributes, { sequelize });

export const associate = (models: {
  [key: string]: ModelCtor<Model>;
}): void => {
  Template.hasMany(models.Email, {
    foreignKey: 'templateId',
    as: 'emails',
  });
};
