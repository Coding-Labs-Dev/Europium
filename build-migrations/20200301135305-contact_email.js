"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('contact_email', {
            contact_id: {
                type: Sequelize.INTEGER,
                references: { model: 'contacts', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            email_id: {
                type: Sequelize.INTEGER,
                references: { model: 'emails', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('contact_email');
    },
};
