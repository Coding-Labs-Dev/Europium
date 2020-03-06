import {
  Sequelize,
  Model,
  ModelCtor,
  DataTypes,
  BuildOptions,
} from 'sequelize';

interface TemplateModel extends Model {
  readonly id: number;
  readonly name: string;
  readonly path: string;
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
  variables: {
    type: DataTypes.JSON,
    allowNull: true,
  },
};

export default class Template extends Model<TemplateModel, TemplateStatic> {}

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
