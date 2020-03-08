/* eslint-disable @typescript-eslint/camelcase */
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: (
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes,
  ): Promise<void[]> => {
    return Promise.all([
      queryInterface.addColumn('Templates', 'subject', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Templates', 'text', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Templates', 'html', {
        type: Sequelize.STRING,
      }),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<void[]> => {
    return Promise.all([
      queryInterface.removeColumn('Templates', 'subject'),
      queryInterface.removeColumn('Templates', 'text'),
      queryInterface.removeColumn('Templates', 'html'),
    ]);
  },
};
