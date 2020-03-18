"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Emails', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            sent: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            templateId: {
                type: Sequelize.INTEGER,
                references: { model: 'Templates', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: false,
            },
            variables: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('Emails');
    },
};
