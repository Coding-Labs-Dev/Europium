import {
  Sequelize,
  Model,
  ModelCtor,
  DataTypes,
  BuildOptions,
} from 'sequelize';

interface ContactTagModel extends Model {
  readonly contactId: number;
  readonly TagId: number;
}

type ContactTagStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ContactTagModel;
} & {
  _defaults: { [key: string]: { [key: string]: object | string | boolean } };
};

const ContactTagAttributes = {
  contactId: {
    type: DataTypes.INTEGER,
    references: { model: 'Contacts', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: false,
    primaryKey: true,
  },
  tagId: {
    type: DataTypes.INTEGER,
    references: { model: 'Tags', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: false,
    primaryKey: true,
  },
};

export default class ContactTag extends Model<
  ContactTagModel,
  ContactTagStatic
> {
  [x: string]: any;
}

export const factory = (sequelize: Sequelize): void =>
  ContactTag.init(ContactTagAttributes, { sequelize, timestamps: false });

// export const associate = (models: {
//   [key: string]: ModelCtor<Model>;
// }): void => {
//   ContactTag.belongsToMany(models.Tag, {
//     through: 'ContactTags',
//     foreignKey: 'contactId',
//     timestamps: false,
//     as: 'tags',
//   });
//   ContactTag.belongsToMany(models.Email, {
//     through: 'ContactEmails',
//     foreignKey: 'contactId',
//     timestamps: false,
//     as: 'emails',
//   });
// };
