import {
  Model,
  ModelCtor,
  DataTypes,
  BuildOptions,
  Sequelize,
} from 'sequelize';

interface TagModel extends Model {
  readonly id: number;
  readonly name: string;
}

type TagStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): TagModel;
} & {
  _defaults: { [key: string]: { [key: string]: object | string | boolean } };
};

export const TagAttributes = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

export default class Tag extends Model<TagModel, TagStatic> {}

export const factory = (sequelize: Sequelize): void =>
  Tag.init(TagAttributes, { sequelize });

export const associate = (models: {
  [key: string]: ModelCtor<Model>;
}): void => {
  Tag.belongsToMany(models.Contact, {
    through: 'ContactTags',
    foreignKey: 'contactId',
    as: 'contacts',
    timestamps: false,
  });
};
