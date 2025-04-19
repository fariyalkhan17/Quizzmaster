"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    const Subject = sequelize.define('Subject', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: true,
        tableName: 'subjects'
    });
    return Subject;
};
