/* eslint-disable @typescript-eslint/camelcase */
import { Sequelize, Model, DataTypes, InitOptions } from 'sequelize';

// export interface ContactProps {
//   id?: number;
//   name?: string;
//   email: string;
//   alternate_names?: string[];
//   active: boolean;
//   created_at?: Date;
//   updated_at?: Date;
// }

export default class Contact extends Model {
  public id!: number;

  public name!: string | null;

  public email!: string;

  public alternate_names!: string[] | null;

  public active!: boolean;

  public created_at!: Date;

  public updated_at!: Date;

  public initiator!: () => void;

  static initiator(sequlize: Sequelize, options?: InitOptions<Contact>): void {
    Contact.init(
      {
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
        alternate_names: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      { ...options, sequelize: sequlize },
    );
  }
}
