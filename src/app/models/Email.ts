/* eslint-disable @typescript-eslint/camelcase */
import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
import connection from '@database/index';

interface EmailModel extends Model {
  readonly id: number;
  readonly sent: Date;
  readonly template_id: number;
  readonly variables: string[];
  readonly created_at: Date;
  readonly updated_at: Date;
}

type EmailStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): EmailModel;
};

export const init = (sequelize: Sequelize): EmailStatic => {
  const Email = sequelize.define('Email', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    sent: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    template_id: {
      type: DataTypes.NUMBER,
      references: { model: 'Templates', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: false,
    },
    variables: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }) as EmailStatic;

  return Email;
};

export default init(connection);
