"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        fullName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        qualification: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        dob: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true
        },
        role: {
            type: sequelize_1.DataTypes.ENUM('admin', 'user'),
            defaultValue: 'user'
        }
    }, {
        timestamps: true,
        tableName: 'users'
    });
    return User;
};
