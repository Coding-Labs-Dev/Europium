import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: (
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes,
  ): Promise<void> => {
    return queryInterface.createTable('Events', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      emailId: {
        type: Sequelize.INTEGER,
        references: { model: 'Emails', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      contactId: {
        type: Sequelize.INTEGER,
        references: { model: 'Contacts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      eventType: {
        type: Sequelize.ENUM(
          'bounce',
          'complaint',
          'delivery',
          'send',
          'reject',
          'open',
          'click',
          'failure',
        ),
        allowNull: false,
      },
      eventDetails: {
        type: Sequelize.JSON,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.dropTable('Events');
  },
};
