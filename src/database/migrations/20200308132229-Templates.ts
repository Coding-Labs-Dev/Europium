/* eslint-disable @typescript-eslint/camelcase */
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.removeColumn('Templates', 'path');
  },

  down: (
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes,
  ): Promise<void> => {
    return queryInterface.addColumn('Templates', 'path', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    });
  },
};
