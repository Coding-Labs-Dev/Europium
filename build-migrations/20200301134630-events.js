"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('events', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            email_id: {
                type: Sequelize.INTEGER,
                references: { model: 'emails', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: false,
            },
            contact_id: {
                type: Sequelize.INTEGER,
                references: { model: 'contacts', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: false,
            },
            event_type: {
                type: Sequelize.ENUM('send', 'reject', 'bounce', 'complaint', 'delivery', 'open', 'click', 'render_failure'),
                allowNull: false,
            },
            event_details: {
                type: Sequelize.JSON,
            },
            created_at: { type: Sequelize.DATE, allowNull: false },
            updated_at: { type: Sequelize.DATE, allowNull: false },
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('events');
    },
};
