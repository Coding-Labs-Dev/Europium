"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface, Sequelize) => {
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
                type: Sequelize.ENUM('bounce', 'complaint', 'delivery', 'send', 'reject', 'open', 'click', 'failure'),
                allowNull: false,
            },
            eventDetails: {
                type: Sequelize.JSON,
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('Events');
    },
};
