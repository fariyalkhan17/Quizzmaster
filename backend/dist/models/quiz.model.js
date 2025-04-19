"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    const Quiz = sequelize.define('Quiz', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        chapter_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'chapters',
                key: 'id'
            }
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        date_of_quiz: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false
        },
        time_duration: {
            type: sequelize_1.DataTypes.STRING, // Format: HH:MM
            allowNull: false
        },
        remarks: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: true,
        tableName: 'quizzes'
    });
    return Quiz;
};
