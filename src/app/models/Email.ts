import {
  Sequelize,
  Model,
  ModelCtor,
  DataTypes,
  BuildOptions,
} from 'sequelize';

interface EmailModel extends Model {
  readonly id: number;
  readonly sendStart: Date;
  readonly sendEnd: Date;
  readonly name: string;
  readonly TemplateId: number;
  readonly variables: string[];

  readonly setContacts: (data: number[]) => Promise<void>;
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  sent: {
    type: DataTypes.DATE,
    allowNull: true,
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

export default class Email extends Model<EmailModel, EmailStatic> {
  readonly id: number;

  readonly sent: Date;

  readonly name: string;

  readonly TemplateId: number;

  readonly variables: string[];

  readonly setContacts: (data: number[]) => Promise<void>;

  readonly contacts: object[];

  readonly template: object;
}

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
    foreignKey: 'emailId',
    timestamps: false,
    as: 'contacts',
  });
  Email.hasMany(models.Event, {
    foreignKey: 'emailId',
    as: 'events',
  });
};
