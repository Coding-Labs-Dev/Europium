import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';

interface ContactEmailModel extends Model {
  readonly contactId: number;
  readonly emailId: number;
}

type ContactEmailStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ContactEmailModel;
} & {
  _defaults: { [key: string]: { [key: string]: object | string | boolean } };
};

const ContactEmailAttributes = {
  contactId: {
    type: DataTypes.INTEGER,
    references: { model: 'Contacts', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: false,
    primaryKey: true,
  },
  emailId: {
    type: DataTypes.INTEGER,
    references: { model: 'Emails', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: false,
    primaryKey: true,
  },
};

export default class ContactEmail extends Model<
  ContactEmailModel,
  ContactEmailStatic
> {
  [x: string]: any;
}

export const factory = (sequelize: Sequelize): void =>
  ContactEmail.init(ContactEmailAttributes, {
    sequelize,
    timestamps: false,
    tableName: 'ContactEmails',
  });
