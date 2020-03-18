"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Templates', {
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
            subject: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            text: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            html: {
                type: Sequelize.STRING,
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
        return queryInterface.dropTable('Templates');
    },
};
