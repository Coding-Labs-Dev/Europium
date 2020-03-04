"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ContactTags', {
            contactId: {
                type: Sequelize.INTEGER,
                references: { model: 'Contacts', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            tagId: {
                type: Sequelize.INTEGER,
                references: { model: 'Tags', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('ContactTags');
    },
};
