"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ContactEmails', {
            contactId: {
                type: Sequelize.INTEGER,
                references: { model: 'Contacts', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            emailId: {
                type: Sequelize.INTEGER,
                references: { model: 'Emails', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('ContactEmails');
    },
};
