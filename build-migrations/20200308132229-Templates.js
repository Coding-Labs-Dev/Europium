"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface) => {
        return queryInterface.removeColumn('Templates', 'path');
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Templates', 'path', {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        });
    },
};
