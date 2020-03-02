/* eslint-disable @typescript-eslint/camelcase */
import {
  Sequelize,
  Model,
  DataTypes,
  BuildOptions,
  ModelAttributes,
  ModelCtor,
} from 'sequelize';
// import connection from '@database/index';

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

// export const init = (sequelize: Sequelize): TemplateStatic => {
//   const Template = sequelize.define('Template', {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//       allowNull: false,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     path: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     variables: {
//       type: DataTypes.JSON,
//       allowNull: true,
//     },
//   }) as TemplateStatic;

//   return Template;
// };

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

class Template extends Model<TemplateModel, TemplateStatic> {}

// init(sequelize: Sequelize, options: BuildOptions): void {
//   super.init(
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false,
//       },
//       name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//       },
//       path: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//       },
//       variables: {
//         type: DataTypes.JSON,
//         allowNull: true,
//       },
//     },
//     options,
//   );
// }

export default Template;
