/* eslint-disable @typescript-eslint/camelcase */
import { Model, ModelCtor, DataTypes, BuildOptions } from 'sequelize';

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

export default class Email extends Model<EmailModel, EmailStatic> {
  static associate(models: { [key: string]: ModelCtor<Model> }): void {
    this.belongsTo(models.Template, {
      foreignKey: 'template_id',
    });
  }
}

export const EmailAttributes = {
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
};
