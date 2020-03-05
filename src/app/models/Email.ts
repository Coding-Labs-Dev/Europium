import {
  Sequelize,
  Model,
  ModelCtor,
  DataTypes,
  BuildOptions,
} from 'sequelize';

interface EmailModel extends Model {
  readonly id: number;
  readonly sent: Date;
  readonly templateId: number;
  readonly variables: string[];
}

type EmailStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): EmailModel;
} & {
  _defaults: { [key: string]: { [key: string]: object | string | boolean } };
};

const EmailAttributes = {
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
  templateId: {
    type: DataTypes.INTEGER,
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

export default class Email extends Model<EmailModel, EmailStatic> {}

export const factory = (sequelize: Sequelize): void =>
  Email.init(EmailAttributes, { sequelize });

export const associate = (models: {
  [key: string]: ModelCtor<Model>;
}): void => {
  Email.belongsTo(models.Template, {
    foreignKey: 'templateId',
    as: 'template',
  });
  Email.belongsToMany(models.Contact, {
    through: 'ContactEmails',
    foreignKey: 'contactId',
    timestamps: false,
    as: 'contacts',
  });
  Email.hasMany(models.Event, {
    foreignKey: 'emailId',
    as: 'events',
  });
};
