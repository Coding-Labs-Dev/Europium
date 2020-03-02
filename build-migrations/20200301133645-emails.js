"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('emails', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            sent: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            template_id: {
                type: Sequelize.INTEGER,
                references: { model: 'templates', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: false,
            },
            variables: {
                type: Sequelize.JSON,
            },
            created_at: { type: Sequelize.DATE, allowNull: false },
            updated_at: { type: Sequelize.DATE, allowNull: false },
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('emails');
    },
};
