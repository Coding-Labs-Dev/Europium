"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface, Sequelize) => {
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
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn('Templates', 'subject'),
            queryInterface.removeColumn('Templates', 'text'),
            queryInterface.removeColumn('Templates', 'html'),
        ]);
    },
};
