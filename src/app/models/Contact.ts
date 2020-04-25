import {
  Sequelize,
  Model,
  ModelCtor,
  DataTypes,
  BuildOptions,
} from 'sequelize';

export interface ContactAttributes {
  readonly id: number;
  readonly name: string | null;
  readonly email: string;
  readonly alternateNames: string[] | null;
  readonly active: boolean;
}

type ContactModel = Model & ContactAttributes;

type ContactStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ContactModel;
} & {
  _defaults: { [key: string]: { [key: string]: object | string | boolean } };
};

const ContactAttributes = {
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
  alternateNames: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
};

export default class Contact extends Model<ContactModel, ContactStatic> {
  readonly id: number;

  readonly name: string | null;

  readonly email: string;

  readonly alternateNames: string[] | null;

  readonly active: boolean;
}

export const factory = (sequelize: Sequelize): void =>
  Contact.init(ContactAttributes, { sequelize, tableName: 'Contacts' });

export const associate = (models: {
  [key: string]: ModelCtor<Model>;
}): void => {
  Contact.belongsToMany(models.Tag, {
    through: 'ContactTags',
    foreignKey: 'contactId',
    timestamps: false,
    as: 'tags',
  });
  Contact.belongsToMany(models.Email, {
    through: 'ContactEmails',
    foreignKey: 'contactId',
    timestamps: false,
    as: 'emails',
  });
  Contact.hasMany(models.Event, {
    foreignKey: 'contactId',
    as: 'events',
  });
};
